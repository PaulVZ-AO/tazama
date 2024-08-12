import axios from "axios"
import Image from "next/image"
import { useContext } from "react"
import { TimeComponent } from "components/timeComponent/TimeComponent"
import EntityContext from "store/entities/entity.context"
import { DeviceInfo } from "./DeviceInfo"

interface DebtorProps {
  selectedEntity: number
  isDebtor?: boolean
}

export function DebtorDevice(props: DebtorProps) {
  const entityCtx = useContext(EntityContext)

  const entity = entityCtx.entities

  const creditorEntity = entityCtx.creditorEntities

  const postPacs002Test = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5500/v1/evaluate/iso20022/pacs.002.001.12",
        entityCtx.pacs002,
        { headers: { "Content-Type": "application/json" } }
      )
      console.log("Test POST PACS002 response: ", response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const postPacs008Test = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5500/v1/evaluate/iso20022/pacs.008.001.10",
        entityCtx.pacs008,
        { headers: { "Content-Type": "application/json" } }
      )

      if (response.status === 200) {
        await postPacs002Test()
      }
      console.log("Test POST PACS008 response: ", response.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="relative col-span-4" style={{ height: "505px" }}>
      <Image src="/device.svg" width="250" height="505" className="absolute inset-x-0 mx-auto" style={{ maxWidth: "250px", minWidth: "250px" }} alt="device info" priority={true} />

      <div className="absolute break-words inset-x-0 mx-auto" style={{ width: "222px", top: "15px" }}>
        <TimeComponent />

        <DeviceInfo selectedEntity={props.selectedEntity} isDebtor={props.isDebtor} />
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
                await postPacs008Test()
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
