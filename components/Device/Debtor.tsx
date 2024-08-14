import axios from "axios"
import Image from "next/image"
import { useContext } from "react"
import { TimeComponent } from "components/timeComponent/TimeComponent"
import EntityContext from "store/entities/entity.context"
import { DeviceInfo } from "./DeviceInfo"

interface EDLights {
  pacs008: boolean
  pacs002: boolean
  color: "r" | "g" | "y" | "n"
}
interface LightsManager {
  ED: EDLights
}

interface TadProcLightsManager {
  TADPROC: {
    result: any
    color: "r" | "g" | "y" | "n"
    stop: boolean
    status: string
  }
}

interface DebtorProps {
  selectedEntity: number
  isDebtor?: boolean
  lights: LightsManager
  setLights: (data: LightsManager) => void
  resetAllLights: () => void
  resetLights: (data: boolean) => void
  setStarted: (data: boolean) => void
}

export function DebtorDevice(props: DebtorProps) {
  const entityCtx = useContext(EntityContext)

  const entity = entityCtx.entities

  const creditorEntity = entityCtx.creditorEntities

  const postPacs002Test = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/v1/evaluate/iso20022/pacs.002.001.12",
        entityCtx.pacs002,
        { headers: { "Content-Type": "application/json" } }
      )
      if (response.status === 200) {
        let data: EDLights = {
          pacs008: true,
          pacs002: true,
          color: "g",
        }
        let newData: any = {
          ED: data,
        }
        props.setLights(newData)
        setTimeout(async () => {
          props.setStarted(false)
        }, 1000)
      } else {
        let data: EDLights = {
          pacs008: true,
          pacs002: false,
          color: "r",
        }
        let newData: LightsManager = {
          ED: data,
        }
        props.setLights(newData)
        setTimeout(async () => {
          props.setStarted(false)
        }, 1000)
      }
      console.log("Test POST PACS002 response: ", response.data)
    } catch (error) {
      console.log(error)
      let data: EDLights = {
        pacs008: true,
        pacs002: false,
        color: "r",
      }
      let newData: LightsManager = {
        ED: data,
      }
      props.setLights(newData)
      setTimeout(async () => {
        props.setStarted(false)
      }, 1000)
    }
  }

  const postPacs008Test = async () => {
    try {
      props.setStarted(true)
      const response = await axios.post(
        "http://localhost:5001/v1/evaluate/iso20022/pacs.008.001.10",
        entityCtx.pacs008,
        { headers: { "Content-Type": "application/json" } }
      )

      if (response.status === 200) {
        if (response.status === 200) {
          let data: EDLights = {
            pacs008: true,
            pacs002: false,
            color: "y", // orange
          }
          let newData: LightsManager = {
            ED: data,
          }
          props.setLights(newData)
        }
        setTimeout(async () => {
          await postPacs002Test()
        }, 1000)
      }
      console.log("Test POST PACS008 response: ", response.data)
    } catch (error: any) {
      const errMsg: any = JSON.parse(error.response.data.split("\n").slice(1).join("\n"))
      console.log(JSON.parse(error.response.data.split("\n").slice(1).join("\n")))
      let data: any = {
        pacs008: props.lights.ED.pacs008,
        pacs002: false,
        color: "r",
      }
      let newData: LightsManager = {
        ED: data,
      }
      props.setLights(newData)
      setTimeout(async () => {
        props.setStarted(false)
      }, 1000)
      // alert(`Error sending PACS008 request. ${JSON.stringify(errMsg.errorMessage)}`)
    }
  }
  return (
    <div className="relative col-span-4" style={{ height: "505px" }}>
      <Image
        src="/device.svg"
        width="250"
        height="505"
        className="absolute inset-x-0 mx-auto"
        style={{ maxWidth: "250px", minWidth: "250px" }}
        alt="device info"
        priority={true}
      />

      <div className="absolute inset-x-0 mx-auto break-words" style={{ width: "222px", top: "15px" }}>
        <TimeComponent />

        <DeviceInfo selectedDebtorEntity={props.selectedEntity} isDebtor={props.isDebtor} />
      </div>

      {props.isDebtor ? (
        <div className="absolute inset-x-0 mx-auto" style={{ width: "222px", bottom: "25px" }}>
          <div
            className={`ml-5 w-4/5 rounded-lg bg-black text-white ${
              entity.length === 0 || creditorEntity.length === 0 ? " pointer-events-none opacity-30" : ""
            }`}
            style={{ padding: ".1em" }}
          >
            <button
              className="w-full rounded-lg border border-white p-1"
              onClick={async () => {
                props.resetAllLights()
                props.setLights({
                  ED: {
                    pacs008: false,
                    pacs002: false,
                    color: "n",
                  },
                })
                props.resetLights(true)
                setTimeout(async () => {
                  await postPacs008Test()
                }, 500)
              }}
            >
              Send
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
