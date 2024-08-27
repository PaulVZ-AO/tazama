import { NextRequest } from "next/server"
import { DBConfig } from "store/processors/processor.interface"
import { getRulesDescriptions, getTypologyDescriptions } from "../../../utils/db"

export async function GET(NextRequest: NextRequest, config: DBConfig) {
  const ruleDescriptions = await getRulesDescriptions(config)
  const typologyDescriptions = await getTypologyDescriptions(config)
  //   console.log(cats)
  return Response.json({
    status: "ok",
    rules: ruleDescriptions,
    typologies: typologyDescriptions,
  })
}
