const { Database, aql } = require("arangojs")
require("dotenv").config()

const getConfigConnection = () => {
  // establish database connection
  return new Database({
    // url: "tcp://localhost:18529",
    url: process.env.NEXT_PUBLIC_ARANGO_DB_HOSTING,
    databaseName: "configuration",
    auth: { username: process.env.NEXT_PUBLIC_DB_USER, password: process.env.NEXT_PUBLIC_DB_PASSWORD },
  })
}

const getTADPROCConnection = () => {
  // establish database connection
  return new Database({
    url: process.env.NEXT_PUBLIC_ARANGO_DB_HOSTING,
    databaseName: "evaluationResults",
    auth: { username: process.env.NEXT_PUBLIC_DB_USER, password: process.env.NEXT_PUBLIC_DB_PASSWORD },
  })
}

const getCollection = async (cName, db) => {
  // get list of collections in database
  try {
    const collections = await db.collections()

    // check if collection exists, if so return collection, if not, create it
    if (collections.find((c) => c._name === cName)) {
      return await db.collection(cName)
    } else {
      return db.createCollection(cName)
    }
  } catch (err) {
    console.log(err)
  }
}

export const getRulesDescriptions = async () => {
  // make connection
  const db = getConfigConnection()
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

  const ruleConfig = []

  if (result.length > 0) {
    result.forEach((rule) => {
      let newRule = {
        id: rule.id,
        title: rule.id.split("@")[0],
        description: rule.desc,
        bands: [],
      }

      rule.config.bands.forEach((band) => {
        let newBand = {
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

export const getTypologyDescriptions = async () => {
  // make connection
  const db = getConfigConnection()
  // make sure rule collection exists
  await getCollection("typologyConfiguration", db)
  // declare array to hold typologies
  let result = []
  // query for typologies
  const results = await db.query(aql`FOR c IN typologyConfiguration RETURN c`)
  // loop through array cursor and push results in array
  for await (let typology of results) {
    result.push(typology)
  }
  // log results
  console.log("TYPO DESCR: ", result)
  // return the list of typologies
  return result
}

export const getTADPROCResult = async (transactionID) => {
  const db = getTADPROCConnection()
  await getCollection("transactions", db)

  let result = []
  const results = await db.query(aql`FOR c IN transactions FILTER c.transactionID == ${transactionID} RETURN c`)

  for await (let transaction of results) {
    result.push(transaction)
  }

  let response = {
    TADPROC: {
      result: null,
      color: "n",
      stop: false,
      status: "NALT",
    },
  }

  if (result.length > 0) {
    response.TADPROC.status = result[0]?.report?.status
    response.TADPROC.result = result[0]?.report?.tadpResult?.typologyResult[0]?.result
    if (result[0]?.report?.status === "NALT") {
      response.TADPROC.color = "g"
    } else if (result[0]?.report?.status === "ALRT") {
      response.TADPROC.color = "y"
    }

    if (result[0]?.report?.tadpResult?.typologyResult[0]?.result >= 400) {
      response.TADPROC.stop = true
    }
  }
  // return the list of typologies
  return response
}

export const getNetworkMap = async () => {
  const db = getConfigConnection()
  await getCollection("networkConfiguration", db)
  await getCollection("ruleConfiguration", db)

  let result = []
  const results = await db.query(aql`FOR c IN networkConfiguration RETURN c`)

  for await (let config of results) {
    result.push(config)
  }

  const typologiesRes = []
  const rulesRes = []

  if (result.length > 0) {
    result[0].messages.forEach((element) => {
      element.typologies.forEach((typology) => {
        let newTypology = {
          id: parseInt(typology.cfg.split("@")[0]),
          title: typology.cfg.split("@")[0],
          color: "n",
          result: null,
          linkedRules: [],
        }
        typology.rules.forEach(async (rule) => {
          let newRule = {
            id: parseInt(rule.id.split("@")[0]),
            title: rule.id.split("@")[0],
            rule: rule.id,
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
          // if (rulesRes.includes(newRule.id)) {
          //   console.log("Rule Exists", newRule)
          // }

          // if (!newRule.linkedTypologies.includes(typology.cfg.split("@")[0])) {
          //   newRule.linkedTypologies.push(typology.cfg.split("@")[0])
          // }

          // make sure rule collection exists

          // declare array to hold rules
          //   let result = []
          //   // query for rules
          //   const results = await db.query(aql`FOR c IN ruleConfiguration FILTER c.id == ${rule.id} RETURN c`)
          //   // loop through array cursor and push results in array
          //   for await (let rule of results) {
          //     result.push(rule)

          //     if (result.length > 0) {
          //       // result.forEach((rule) => {
          //       //   newRule.ruleDescription = rule.desc
          //       //   rule.config.bands.forEach((band) => {
          //       //     let newBand = {
          //       //       subRuleRef: band.subRuleRef,
          //       //       lowerLimit: band.lowerLimit ? band.lowerLimit : null,
          //       //       upperLimit: band.upperLimit ? band.upperLimit : null,
          //       //       reason: band.reason,
          //       //     }
          //       //     newRule.bands.push(newBand)
          //       //   })
          //       // })
          //       newRule.ruleDescription = result[0].desc
          //       console.log("RULE ID: ", result[0].id)
          //       if (result[0].config.hasOwnProperty("bands")) {
          //         console.log("BANDS EXIST")
          //         result[0].config.bands.forEach((band) => {
          //           let newBand = {
          //             subRuleRef: band.subRuleRef,
          //             lowerLimit: band.lowerLimit ? band.lowerLimit : null,
          //             upperLimit: band.upperLimit ? band.upperLimit : null,
          //             reason: band.reason,
          //           }
          //           newRule.ruleBands.push(newBand)
          //         })
          //       } else if (result[0].config.hasOwnProperty("cases")) {
          //         console.log("CASES EXIST")
          //         result[0].config.cases.forEach((item) => {
          //           let newBand = {
          //             subRuleRef: item.subRuleRef,
          //             lowerLimit: item.lowerLimit ? item.lowerLimit : null,
          //             upperLimit: item.upperLimit ? item.upperLimit : null,
          //             reason: item.reason,
          //           }
          //           newRule.ruleBands.push(newBand)
          //         })
          //       }
          //       rulesRes.push(newRule)
          //     }

          newTypology.linkedRules.push(newRule.title)
          //     // if (!rules.includes(newRule)) {
          //     //   console.log("Adding rule " + newRule)
          //     //   rules.push(newRule)
          //     // }
          //   }
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
          result[0].config.bands.forEach((band) => {
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
          result[0].config.cases.forEach((item) => {
            let newBand = {
              subRuleRef: item.subRuleRef,
              lowerLimit: item.lowerLimit ? item.lowerLimit : null,
              upperLimit: item.upperLimit ? item.upperLimit : null,
              reason: item.reason,
            }
            rule.ruleBands.push(newBand)
          })
        }
        typologiesRes.forEach((typology) => {
          if (typology.linkedRules.includes(rule.title)) {
            rule.linkedTypologies.push(typology.title)
          }
        })
      }
    }
  })

  return {
    rules: finalRules,
    typologies: typologiesRes,
  }
}
