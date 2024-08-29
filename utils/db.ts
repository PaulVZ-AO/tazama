import { config } from "./../middleware"
import {
  RuleResult,
  RuleBand,
  TADPROC_RESULT,
  Typology,
  RuleConfig,
  TADPROC,
  Rule,
  DBConfig,
} from "store/processors/processor.interface"

const { Database, aql } = require("arangojs")
require("dotenv").config()

// PASS ALL .ENV VARIABLES INTO THE FUNCTIONS FROM THE FE THAT COMES FROM THE LOCAL STORAGE

const getConfigConnection = (config: DBConfig) => {
  // establish database connection
  // return new Database({
  //   url: process.env.NEXT_PUBLIC_ARANGO_DB_HOSTING,
  //   databaseName: "configuration",
  //   auth: { username: process.env.NEXT_PUBLIC_DB_USER, password: process.env.NEXT_PUBLIC_DB_PASSWORD },
  // })
  console.log("-------------> config: ", config)
  return new Database({
    url: config.url,
    databaseName: "configuration",
    auth: { username: config.auth.username, password: config.auth.password },
  })
}

const getTADPROCConnection = (config: any) => {
  // establish database connection
  return new Database({
    url: config.url,
    databaseName: "evaluationResults",
    auth: { username: config.auth.username, password: config.auth.password },
  })
}

const getCollection = async (cName: string, db: any) => {
  // get list of collections in database
  try {
    const collections = await db.collections()

    // check if collection exists, if so return collection, if not, create it
    if (collections.find((c: any) => c._name === cName)) {
      return await db.collection(cName)
    } else {
      return db.createCollection(cName)
    }
  } catch (err) {
    console.log(err)
  }
}

export const getRulesDescriptions = async (config: any) => {
  // make connection
  const db = getConfigConnection(config)
  // make sure rule collection exists
  await getCollection("ruleConfiguration", db)
  // declare array to hold rules
  let result = []
  // query for rules
  const results = await db.query(aql`FOR c IN ruleConfiguration RETURN c`)
  // loop through array cursor and push results in array
  for await (let rule of results) {
    result.push(rule)
  }

  const ruleConfig: any[] = []

  if (result.length > 0) {
    result.forEach((rule) => {
      let newRule: RuleConfig = {
        id: rule.id,
        title: rule.id.split("@")[0],
        description: rule.desc,
        bands: [],
      }

      rule.config.bands.forEach((band: any) => {
        let newBand: RuleBand = {
          subRuleRef: band.subRuleRef,
          lowerLimit: band.lowerLimit ? band.lowerLimit : null,
          upperLimit: band.upperLimit ? band.upperLimit : null,
          reason: band.reason,
        }
        newRule.bands.push(newBand)
      })

      ruleConfig.push(newRule)
      // console.log(newRule)
    })
  }
  // log results
  console.log("RULE DESCR: ", ruleConfig)
  // return the list of rules
  return result
}

export const getTypologyDescriptions = async (config: DBConfig) => {
  // make connection
  const db: typeof Database = getConfigConnection(config)
  // make sure rule collection exists
  await getCollection("typologyConfiguration", db)
  // declare array to hold typologies
  let result = []
  // query for typologies
  const results: any = await db.query(aql`FOR c IN typologyConfiguration RETURN c`)
  // loop through array cursor and push results in array
  for await (let typology of results) {
    result.push(typology)
  }
  // log results
  console.log("TYPO DESCR: ", result)
  // return the list of typologies
  return result
}

export const getTADPROCResult = async (transactionID: string, config: DBConfig) => {
  const db = getTADPROCConnection(config)
  await getCollection("transactions", db)

  let result = []
  const results = await db.query(aql`FOR c IN transactions FILTER c.transactionID == ${transactionID} RETURN c`)

  for await (let transaction of results) {
    result.push(transaction)
  }

  if (result.length > 0) {
    let response: TADPROC = {
      status: result[0]?.report?.status,
      stop: false,
      color: "n",
      results: [],
    }
    // DOUBLE CHECK THIS LOGIC
    if (result[0]?.report?.status === "NALT") {
      response.color = "g"
    } else if (result[0]?.report?.status === "ALRT") {
      response.color = "y"
    }

    let tr = result[0]?.report?.tadpResult?.typologyResult
    // LOOP HERE
    if (tr.length > 0) {
      tr.forEach((typoRes: any) => {
        // new result object
        let typoResult: TADPROC_RESULT = {
          cfg: typoRes.cfg,
          result: typoRes.result,
          workflow: {
            alertThreshold: null,
            interdictionThreshold: null,
          },
          ruleResults: [],
        }

        // modify result object
        typoRes.ruleResults.forEach((result: RuleResult) => {
          typoResult.ruleResults.push(result)
        })

        typoResult.workflow.interdictionThreshold = typoRes.workflow.interdictionThreshold
          ? typoRes.workflow.interdictionThreshold
          : null

        typoResult.workflow.alertThreshold = typoRes.workflow.alertThreshold ? typoRes.workflow.alertThreshold : null

        if (typoResult.workflow.interdictionThreshold !== null) {
          if (typoRes.result >= typoResult.workflow.interdictionThreshold) {
            response.stop = true
            response.color = "r"
          }
        }

        response.results.push(typoResult)
      })
    }
    // return the list of typologies
    return response
  }
}

const getTypologyDetails = async (cfg: string, config: DBConfig) => {
  const db = getConfigConnection(config)
  await getCollection("typologyConfiguration", db)
  let result = []
  const results = await db.query(aql`FOR typo IN typologyConfiguration FILTER typo.cfg == ${cfg} RETURN typo`)

  for await (let typo of results) {
    result.push(typo)
  }

  db.close()

  return result
}

export const getNetworkMap = async (config: DBConfig) => {
  const db = await getConfigConnection(config)
  await getCollection("networkConfiguration", db)
  await getCollection("ruleConfiguration", db)

  let result = []
  const results = await db.query(aql`FOR c IN networkConfiguration FILTER c.active == true RETURN c`)

  for await (let config of results) {
    result.push(config)
  }

  const typologiesRes: any[] = []
  const rulesRes: any[] = []

  if (result.length > 0) {
    result[0].messages.forEach((element: any) => {
      element.typologies.forEach((typology: any) => {
        // console.log("TYPO DESC: ", typo[0].desc)

        let newTypology: Typology = {
          id: typology.cfg,
          title: typology.cfg.split("@")[0],
          color: "n",
          result: null,
          typoDescription: "",
          workflow: { interdictionThreshold: null, alertThreshold: null },
          linkedRules: [],
        }
        typology.rules.forEach(async (rule: Rule) => {
          let ruleId: any = rule.id.toString().split("@")[0]
          let newRule: Rule = {
            id: parseFloat(ruleId),
            title: ruleId,
            rule: rule.id.toString(),
            ruleDescription: "",
            color: "n",
            result: null,
            linkedTypologies: [],
            ruleBands: [],
          }
          rulesRes.push(newRule)

          rulesRes.map(async (r) => {
            if (r.id === rule.id) {
              r.linkedTypologies.push(typology.cfg.split("@")[0])
            }
          })

          newTypology.linkedRules.push(newRule.title)
        })
        typologiesRes.push(newTypology)
      })
    })
  }
  const finalRules = []
  for (let i = 0; i < rulesRes.length; i++) {
    let rule = rulesRes[i]
    let found = false
    for (let j = 0; j < finalRules.length; j++) {
      if (finalRules[j].id === rule.id) {
        found = true
        break
      }
    }
    if (!found) {
      finalRules.push(rule)
    }
  }

  finalRules.forEach(async (rule) => {
    await getCollection("ruleConfiguration", db)

    let result = []
    // query for rules
    const results = await db.query(aql`FOR c IN ruleConfiguration FILTER c.id == ${rule.rule} RETURN c`)
    // loop through array cursor and push results in array
    for await (let r of results) {
      result.push(r)

      if (result.length > 0) {
        rule.ruleDescription = result[0].desc
        console.log("RULE ID: ", result[0].id)
        if (result[0].config.hasOwnProperty("bands")) {
          console.log("BANDS EXIST")
          result[0].config.bands.forEach((band: RuleBand) => {
            let newBand = {
              subRuleRef: band.subRuleRef,
              lowerLimit: band.lowerLimit ? band.lowerLimit : null,
              upperLimit: band.upperLimit ? band.upperLimit : null,
              reason: band.reason,
            }
            rule.ruleBands.push(newBand)
          })
        } else if (result[0].config.hasOwnProperty("cases")) {
          console.log("CASES EXIST")
          result[0].config.cases.forEach((item: RuleBand) => {
            let newBand: RuleBand = {
              subRuleRef: item.subRuleRef,
              lowerLimit: item.lowerLimit ? item.lowerLimit : null,
              upperLimit: item.upperLimit ? item.upperLimit : null,
              reason: item.reason,
            }
            rule.ruleBands.push(newBand)
          })
        } else if (result[0].config.hasOwnProperty("exitConditions")) {
          console.log("EXIT CONDITIONS EXIST")
          result[0].config.exitConditions.forEach((item: RuleBand) => {
            let newCondition: RuleBand = {
              subRuleRef: item.subRuleRef,
              lowerLimit: item.lowerLimit ? item.lowerLimit : null,
              upperLimit: item.upperLimit ? item.upperLimit : null,
              reason: item.reason,
            }
            rule.ruleBands.push(newCondition)
          })
        }

        typologiesRes.forEach(async (typology) => {
          if (typology.linkedRules.includes(rule.title)) {
            rule.linkedTypologies.push(typology.title)
          }
        })
      }
    }
  })
  typologiesRes.forEach(async (typology) => {
    let typo = await getTypologyDetails(typology.id, config)
    console.log("TYPO CONFIG: ", typo[0])
    typology.typoDescription = typo[0].desc

    typology.workflow.interdictionThreshold = typo[0].workflow.hasOwnProperty("interdictionThreshold")
      ? typo[0].workflow.interdictionThreshold
      : null

    typology.workflow.alertThreshold = typo[0].workflow.hasOwnProperty("alertThreshold")
      ? typo[0].workflow.alertThreshold
      : null
  })

  return {
    rules: finalRules,
    typologies: typologiesRes,
  }
}