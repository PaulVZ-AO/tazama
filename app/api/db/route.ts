import { getRulesDescriptions, getTypologyDescriptions } from "./../../../utils/db"

export async function GET() {
  const ruleDescriptions = await getRulesDescriptions()
  const typologyDescriptions = await getTypologyDescriptions()
  //   console.log(cats)
  return Response.json({
    status: "ok",
    rules: ruleDescriptions,
    typologies: typologyDescriptions,
  })
}
