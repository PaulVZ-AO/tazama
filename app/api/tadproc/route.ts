import { getTADPROCResult } from "../../../utils/db"

export async function GET(transactionID: string) {
  console.log("trID", transactionID)
  const result = await getTADPROCResult(transactionID)
  //   console.log(cats)
  return Response.json({
    status: "ok",
    result: result,
  })
}
