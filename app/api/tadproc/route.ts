import { NextRequest } from "next/server"
import { DBConfig } from "store/processors/processor.interface"
import { getTADPROCResult } from "../../../utils/db"

export async function GET(NextRequest: NextRequest, transactionID: string, config: DBConfig) {
  console.log("trID", transactionID)
  const result = await getTADPROCResult(transactionID, config)
  //   console.log(cats)
  console.log("NextRequest", NextRequest.body)
  return Response.json({
    status: "ok",
    result: result,
  })
}
