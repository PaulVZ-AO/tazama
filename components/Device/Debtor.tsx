import { TimeComponent } from "components/timeComponent/TimeComponent"
import Image from "next/image"
import { DeviceInfo } from "./DeviceInfo"

interface DebtorProps {
  selectedEntity: number
  isDebtor?: boolean
}

export function DebtorDevice(props: DebtorProps) {
  return (
    <div className="relative col-span-4" style={{ height: "505px" }}>
      <Image src="/device.svg" width="250" height="505" className="absolute left-8 top-0 " alt="" priority={true} />

      <div className="absolute" style={{ marginLeft: "46px", width: "222px", top: "15px" }}>
        <TimeComponent />

        <DeviceInfo selectedEntity={props.selectedEntity} isDebtor={props.isDebtor} />
      </div>

      <div className="absolute" style={{ marginLeft: "50px", width: "222px", bottom: "25px" }}>
        <div className="ml-5 w-4/5 rounded-lg bg-black text-white" style={{ padding: ".1em" }}>
          <button className="w-full rounded-lg border border-white p-1">Send</button>
        </div>
      </div>
    </div>
  )
}
