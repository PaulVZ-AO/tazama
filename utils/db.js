const { Database, aql } = require("arangojs")
require("dotenv").config()

const getRulesConnection = () => {
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
  const db = getRulesConnection()
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
  // log results
  console.log(result)
  // return the list of rules
  return result
}

export const getTypologyDescriptions = async () => {
  // make connection
  const db = getRulesConnection()
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
  console.log(result)
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
