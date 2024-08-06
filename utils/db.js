const { Database, aql } = require("arangojs");

// const getConnection = () => {
//   // establish database connection
//   return new Database({
//     url: "https://8ae29224ea5c.arangodb.cloud:8529",
//     databaseName: "travel_zbucD0qq",
//     auth: { username: "root", password: "aR0KF6IH8O0SBH20WjiY" },
//   });
// };

const getConnection = () => {
  // establish database connection
  return new Database({
    url: "tcp://localhost:18529",
    databaseName: "configuration",
    auth: { username: "root", password: "" },
  });
};

const getCollection = async (cName, db) => {
  // get list of collections in database
  try {
    const collections = await db.collections();

  // check if collection exists, if so return collection, if not, create it
  if (collections.find((c) => c._name === cName)) {
    return await db.collection(cName);
  } else {
    return db.createCollection(cName);
  }
  } catch (err) {
    console.log(err);
  }
  
};

export const getRulesDescriptions = async () => {
  // make connection
  const db = getConnection()
  // make sure rule collection exists
  await getCollection("ruleConfiguration", db);
  // declare array to hold rules
  let result = [];
  // query for rules
  const results = await db.query(aql`FOR c IN ruleConfiguration RETURN c`);
  // loop through array cursor and push results in array
  for await (let rule of results) {
    result.push(rule);
  }
  // log results
  console.log(result);
  // return the list of rules
  return result;
};

export const getTypologyDescriptions = async () => {
  // make connection
  const db = getConnection()
  // make sure rule collection exists
  await getCollection("typologyConfiguration", db);
  // declare array to hold typologies
  let result = [];
  // query for typologies
  const results = await db.query(aql`FOR c IN typologyConfiguration RETURN c`);
  // loop through array cursor and push results in array
  for await (let typology of results) {
    result.push(typology);
  }
  // log results
  console.log(result);
  // return the list of typologies
  return result;
};