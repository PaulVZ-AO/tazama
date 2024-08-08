"use client"

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import io from "socket.io-client"
import { DebtorDevice } from "components/Device/Debtor"
import { Modal } from "components/Modal/Modal"
import { ProcessIndicator } from "components/ProcessIndicator/ProcessIndicator"
import { Profile } from "components/Profile/Profile"
import { CreditorProfile } from "components/ProfileCreditor/ProfileCreditor"
import { StatusIndicator } from "components/StatusIndicator/StatusIndicator"
import EntityContext from "store/entities/entity.context"
import { getTADPROCResult } from "utils/db"

interface LightsManager {
  ED: {
    pacs008: boolean
    pacs002: boolean
    color: "r" | "g" | "y" | "n"
  }
}

interface RuleLight {
  id: number
  title: string
  color: "r" | "g" | "y" | "n"
  result: any
}

interface RuleLightsManager {
  lights: Array<RuleLight>
}

const defaultLights: LightsManager = {
  ED: {
    pacs008: false,
    pacs002: false,
    color: "n",
  },
}

const Web = () => {
  const [rules, setRules] = useState<any[]>([])
  const [types, setTypes] = useState<any[] | null>(null)
  const [descriptions, setDescriptions] = useState<any[] | null>(null)
  const [hoveredRule, setHoveredRule] = useState<any>(null)
  const [hoveredType, setHoveredType] = useState<any>(null)
  const [lights, setLights] = useState<LightsManager>(defaultLights)
  const [ruleLights, setRuleLights] = useState<RuleLight[]>([])
  const [showModal, setModal] = useState(false)
  const entityCtx = useContext(EntityContext)

  useEffect(() => {
    console.log("LIGHTS: ", rules)
  }, [rules])

  useEffect(() => {
    const socket = io()
    const findIndexOfRule = async (search: string) => {
      const index = rules?.findIndex((rule: RuleLight) => {
        rule.title === search
      })
      return index
    }

    socket.on("connection", (msg) => {
      console.log("Connected to WebSocket server", msg)
    })
    socket.emit("subscriptions", { subscriptions: ["connection", ">", "typology-999@1.0.0", "cms"] })

    socket.on("welcome", (msg) => {
      console.log("Received Message from the welcome: ", msg)
      socket.emit("confirmation", msg)
    })
    socket.on("ruleRequest", async (msg) => {
      console.log("Received Message from the RULE REQUEST: ", msg)
    })

    socket.on("ruleResponse", async (msg) => {
      console.log("Received Message from the RULE RESPONSE: ", msg)
      console.log("RULE: ", msg.ruleResult.id.split("@")[0], msg.ruleResult.subRuleRef)

      let ruleArray: RuleLight[] = rules.length > 1 ? rules : []
      const index = rules.findIndex((r) => r.title === msg.ruleResult.id.split("@")[0])
      console.log("RULE_LIGHTS", rules, index)
      if ((index > -1 && ruleArray !== undefined && ruleArray.length > 0, index !== undefined)) {
        rules[index].result = msg.ruleResult
      }
      if (msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId !== undefined) {
        const results = await getTADPROCResult(msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
        console.log("RESULT", results)
      }
    })

    socket.on("typoRequest", async (msg) => {
      console.log("Received Message from the TYPO REQUEST: ", msg)
    })

    socket.on("typoResponse", async (msg) => {
      console.log("Received Message from the TYPO RESPONSE: ", msg)
      if (msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId !== undefined) {
        const results = await getTADPROCResult(msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
        console.log("RESULT", results)
      }
    })

    socket.on("typoRequest", async (msg) => {
      console.log("Received Message from the TYPO REQUEST: ", msg)
    })

    socket.on("tadProc", async (msg) => {
      console.log("Received Message from the TADPROC: ", msg)
    })

    socket.on("stream", async (msg) => {
      console.log("Received Message from the Stream: ", msg)
      // Object.keys(msg).forEach(async (key) => {
      // if (key === "typologyResult" || key === "ruleResult") {
      //   console.log("MSG_ID: ", msg.transaction.FIToFIPmtSts.GrpHdr.MsgId)
      if (msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId !== undefined) {
        const results = await getTADPROCResult(msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
        console.log("RESULT", results)
      }
      //   }
      // })
    })
    socket.on("subscriptions", (msg) => {
      console.log(msg)
    })
    socket.onAny((event, ...args) => {
      console.log(`got ${event}`)
    })

    return () => {
      socket.disconnect()
    }
  }, [rules!])

  const handleRuleMouseEnter = (type: any) => {
    setHoveredType(null) // fallback if stats is stuck
    setHoveredRule(type)
  }

  const handleRuleMouseLeave = () => {
    setHoveredRule(null)
    setHoveredType(null) // fallback if stats is stuck
  }

  const handleTypeMouseEnter = (type: any) => {
    setHoveredRule(null) // fallback if stats is stuck
    setHoveredType(type)
  }

  const handleTypeMouseLeave = () => {
    setHoveredRule(null) // fallback if stats is stuck
    setHoveredType(null)
  }

  function RuleRow(props: any) {
    let t = props.rule.t.map(function (type: any) {
      return type.t
    })

    let typeRel = ""

    if (hoveredType) {
      for (let index = 0; index < hoveredType.r.length; index++) {
        if (hoveredType.r[index].r === props.rule.r) {
          typeRel = "bg-gray-200"
        }
      }
    }

    return (
      <li
        className={`flex rounded-md px-2 hover:bg-gray-200 ${typeRel}`}
        data-type={t}
        key={`r-${props.rule.r}`}
        onMouseEnter={() => handleRuleMouseEnter(props.rule)}
        onMouseLeave={handleRuleMouseLeave}
      >
        <StatusIndicator colour={props.rule.s} /> &nbsp;
        {props.rule.v}
      </li>
    )
  }

  function TypeRow(props: any) {
    let r = props.rule.r.map(function (type: any) {
      return type.r
    })

    let ruleRel = ""

    if (hoveredRule) {
      for (let index = 0; index < hoveredRule.t.length; index++) {
        if (hoveredRule.t[index].t === props.rule.t) {
          ruleRel = "bg-gray-200"
        }
      }
    }

    return (
      <li
        className={`flex rounded-md px-2 hover:bg-gray-200 ${ruleRel}`}
        data-rule={r}
        key={`t-${props.rule.t}`}
        onMouseEnter={() => handleTypeMouseEnter(props.rule)}
        onMouseLeave={handleTypeMouseLeave}
      >
        <StatusIndicator colour={props.rule.s} /> &nbsp;
        {props.rule.v}
      </li>
    )
  }

  function RuleResult() {
    if (hoveredRule === null) return null

    return (
      <div className="rounded-xl p-5 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
        <h3 className="text-center uppercase">Rule Results</h3>

        <div className="p-5">
          <div className="mb-2 p-2 text-center">
            {hoveredRule} {hoveredRule && hoveredRule.r ? hoveredRule.r : ""}=
            {hoveredRule ? (hoveredRule.s === "g" ? "true" : "false") : ""} False
          </div>
          <hr className="mb-2 border-black" />
          <div className="mb-2 p-2 text-center">
            Creditor account is less than 1 day old.
            {hoveredRule && hoveredRule.s !== "g" && hoveredRule.d ? hoveredRule.d : ""}
          </div>
        </div>
      </div>
    )
  }

  function TypeResult() {
    // if (hoveredType == null)
    //   return(null);

    return (
      <div className="rounded-xl p-5 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
        <h3 className="text-center uppercase">Type Results</h3>

        <div className="mb-2 p-2 text-center">
          105 {hoveredType && hoveredType.t ? hoveredType.t : ""}=
          {hoveredType ? (hoveredType.s === "g" ? "true" : "false") : ""} 600
        </div>
        <div className="mb-2 flex p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
          500
        </div>
        <div className="mb-2 flex p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
            />
          </svg>
          none
        </div>
        <div className="mb-2 p-2 text-center">Description on the hover code</div>
      </div>
    )
  }

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState(null)
  const [selectedEntity, setSelectedEntity] = useState<number>(0)
  const [selectedCreditorEntity, setSelectedCreditorEntity] = useState<number>(0)

  const handleAccountChange = async (creditorIdx: number, accountIdx: number) => {
    await entityCtx.setCreditorAccountPacs008(creditorIdx, accountIdx)
  }

  useEffect(() => {
    setSelectedEntity(entityCtx.selectedDebtorEntity.debtorSelectedIndex || 0)
  }, [entityCtx.selectedDebtorEntity.debtorSelectedIndex])

  useEffect(() => {
    setSelectedCreditorEntity(entityCtx.selectedCreditorEntity.creditorSelectedIndex || 0)
  }, [entityCtx.selectedCreditorEntity.creditorSelectedIndex])

  useEffect(() => {
    axios
      .get("api/rules")
      .then((response) => {
        let array: any = []
        setRules(response.data.rules.rule)
        // response.data.rules.rule.forEach((rule: any) => {
        //   let newRules: RuleLight = { id: rule.id, color: "n", title: rule.title, result: null }
        //   console.log("CREATING RULE: ", newRules.title)
        //   array.push(newRules)
        // })
        // if (array.length > 0) {
        //   setRuleLights({ lights: array })
        // }
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    axios
      .get("api/configs")
      .then((response) => {
        console.log(response)
        setDescriptions(response.data.rules[0].config.bands)
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })
  }, [])

  const fetchResult = async (transactionID: string) => {
    const result = await getTADPROCResult(transactionID)
    return result
  }

  useEffect(() => {
    console.log("RULE DESCRIPTIONS: ", descriptions)
  }, [descriptions])

  useEffect(() => {
    axios
      .get("api/typologies")
      .then((response) => {
        setTypes(response.data.types.type)
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })
  }, [])
  useEffect(() => {
    console.log("SELECTED ENTITY: ", selectedEntity)
  }, [selectedEntity])

  useEffect(() => {
    console.log("SELECTED CREDITOR ENTITY: ", selectedCreditorEntity)
  }, [selectedCreditorEntity])

  useEffect(() => {
    console.log("DEBTORS: ", entityCtx.entities)
  }, [entityCtx.entities])

  useEffect(() => {
    console.log("CREDITORS: ", entityCtx.creditorEntities)
  }, [entityCtx.creditorEntities])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="bg-slate-300/25 px-5 pt-10">
      <div className="grid grid-cols-12 gap-5">
        {/* Debtors */}
        <div className="col-span-2">
          <div className="flex flex-wrap justify-center rounded-lg p-5 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
            <div className="mb-5 text-center text-xl">Debtors</div>

            <Profile
              colour={!entityCtx.entities[0] ? "text-gray-300" : "text-blue-500"}
              entity={entityCtx.entities[0]?.Entity}
              accounts={entityCtx.entities[0]?.Accounts}
              index={0}
              setModalVisible={setModal}
              setSelectedEntity={() => setSelectedEntity(0)}
              selectedEntity={selectedEntity}
              addAccount={async () => {
                await entityCtx.createEntityAccount(0)
                await entityCtx.selectDebtorEntity(0, 0)
                // await entityCtx.selectDebtorEntity
              }}
            />
            <Profile
              colour={!entityCtx.entities[1] ? "text-gray-300" : "text-green-500"}
              entity={entityCtx.entities[1]?.Entity}
              accounts={entityCtx.entities[1]?.Accounts}
              index={1}
              setModalVisible={setModal}
              setSelectedEntity={() => setSelectedEntity(1)}
              selectedEntity={selectedEntity}
              addAccount={async () => {
                await entityCtx.createEntityAccount(1)
                await entityCtx.selectDebtorEntity(1, 0)
              }}
            />
            <Profile
              colour={!entityCtx.entities[2] ? "text-gray-300" : "text-yellow-400"}
              entity={entityCtx.entities[2]?.Entity}
              accounts={entityCtx.entities[2]?.Accounts}
              index={2}
              setModalVisible={setModal}
              setSelectedEntity={() => setSelectedEntity(2)}
              selectedEntity={selectedEntity}
              addAccount={async () => {
                await entityCtx.createEntityAccount(2)
                await entityCtx.selectDebtorEntity(2, 0)
              }}
            />
            <Profile
              colour={!entityCtx.entities[3] ? "text-gray-300" : "text-orange-500"}
              entity={entityCtx.entities[3]?.Entity}
              accounts={entityCtx.entities[3]?.Accounts}
              index={3}
              setModalVisible={setModal}
              setSelectedEntity={() => setSelectedEntity(3)}
              selectedEntity={selectedEntity}
              addAccount={async () => {
                await entityCtx.createEntityAccount(3)
                await entityCtx.selectDebtorEntity(3, 0)
              }}
            />
          </div>
        </div>

        {/* Device transactions */}
        <div className="col-span-8">
          <div className="grid grid-cols-12 gap-1">
            <div className="col-span-4">
              <DebtorDevice selectedEntity={selectedEntity} isDebtor={true} lights={lights} setLights={setLights} />
            </div>
            <div className="col-span-4 flex items-center justify-between px-5">
              <ProcessIndicator />
            </div>
            <div className="col-span-4">
              <DebtorDevice
                selectedEntity={selectedCreditorEntity}
                isDebtor={false}
                lights={lights}
                setLights={setLights}
              />
              {/* <Image src="/device.svg" height="200" width="200" className="text-center" alt="" priority={true} /> */}
            </div>
          </div>
        </div>

        {/* Creditors */}
        <div className="col-span-2">
          <div className="flex flex-wrap justify-center rounded-lg p-5 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
            <div className="mb-5 text-center text-xl">Creditors</div>
            <CreditorProfile
              colour={!entityCtx.creditorEntities[0] ? "text-gray-300" : "text-blue-500"}
              reverse={true}
              entity={entityCtx.creditorEntities[0]?.CreditorEntity}
              creditorAccounts={entityCtx.creditorEntities[0]?.CreditorAccounts}
              setModalVisible={setModal}
              setSelectedEntity={async (idx: number) => {
                setSelectedCreditorEntity(0)
                if (
                  entityCtx.creditorEntities[0]?.CreditorAccounts.length !== -1 &&
                  entityCtx.creditorEntities[0]?.CreditorAccounts.length !== undefined
                ) {
                  // let idx = 0
                  // if (entityCtx.creditorEntities[0]?.CreditorAccounts.length !== -1) {
                  //   // if (entityCtx.entities[0]?.Accounts.length !== -1) {
                  //   // idx = entityCtx.entities[0]?.Accounts.length - 1
                  //   idx = entityCtx.creditorEntities[0]?.CreditorAccounts.length - 1
                  // }

                  await entityCtx.setCreditorAccountPacs008(0, idx)
                }
              }}
              index={0}
              selectedEntity={selectedCreditorEntity}
              addAccount={async () => {
                await entityCtx.createCreditorEntityAccount(0)
                // if (entityCtx.entities[0]?.Accounts.length !== -1 && entityCtx.entities[0]?.Accounts !== undefined) {
                if (
                  entityCtx.creditorEntities[0]?.CreditorAccounts.length !== -1 &&
                  entityCtx.creditorEntities[0]?.CreditorAccounts.length !== undefined
                ) {
                  let idx = 0
                  if (entityCtx.creditorEntities[0]?.CreditorAccounts.length !== -1) {
                    // if (entityCtx.entities[0]?.Accounts.length !== -1) {
                    // idx = entityCtx.entities[0]?.Accounts.length - 1
                    idx = entityCtx.creditorEntities[0]?.CreditorAccounts.length - 1
                  }
                  await entityCtx.setCreditorAccountPacs008(0, idx)
                }
              }}
            />
            <CreditorProfile
              colour={!entityCtx.creditorEntities[1] ? "text-gray-300" : "text-green-500"}
              reverse={true}
              entity={entityCtx.creditorEntities[1]?.CreditorEntity}
              creditorAccounts={entityCtx.creditorEntities[1]?.CreditorAccounts}
              setModalVisible={setModal}
              index={1}
              setSelectedEntity={async (idx: number) => {
                setSelectedCreditorEntity(1)
                if (
                  entityCtx.creditorEntities[1]?.CreditorAccounts.length !== -1 &&
                  entityCtx.creditorEntities[1]?.CreditorAccounts.length !== undefined
                ) {
                  // let idx = 0
                  // if (entityCtx.creditorEntities[1]?.CreditorAccounts.length !== -1) {
                  // if (entityCtx.entities[1]?.Accounts.length !== -1) {
                  // idx = entityCtx.entities[1]?.Accounts.length - 1
                  // idx = entityCtx.creditorEntities[1]?.CreditorAccounts.length - 1
                  // }
                  // await entityCtx.selectCreditorEntity(1, idx)
                  await entityCtx.setCreditorAccountPacs008(1, idx)
                }
              }}
              // setSelectedEntity={() => setSelectedCreditorEntity(1)}
              selectedEntity={selectedCreditorEntity}
              addAccount={async () => {
                await entityCtx.createCreditorEntityAccount(1)
                if (
                  entityCtx.creditorEntities[1]?.CreditorAccounts.length !== -1 &&
                  entityCtx.creditorEntities[1]?.CreditorAccounts.length !== undefined
                ) {
                  let idx = 0
                  if (entityCtx.creditorEntities[1]?.CreditorAccounts.length !== -1) {
                    // if (entityCtx.entities[0]?.Accounts.length !== -1) {
                    // idx = entityCtx.entities[0]?.Accounts.length - 1
                    idx = entityCtx.creditorEntities[1]?.CreditorAccounts.length - 1
                  }
                  await entityCtx.setCreditorAccountPacs008(1, idx)
                }
              }}
            />
            <CreditorProfile
              colour={!entityCtx.creditorEntities[2] ? "text-gray-300" : "text-yellow-400"}
              reverse={true}
              entity={entityCtx.creditorEntities[2]?.CreditorEntity}
              creditorAccounts={entityCtx.creditorEntities[2]?.CreditorAccounts}
              setModalVisible={setModal}
              setSelectedEntity={() => setSelectedCreditorEntity(2)}
              index={2}
              selectedEntity={selectedCreditorEntity}
              addAccount={async () => {
                await entityCtx.createCreditorEntityAccount(2)
                if (
                  entityCtx.creditorEntities[2]?.CreditorAccounts.length !== -1 &&
                  entityCtx.creditorEntities[2]?.CreditorAccounts.length !== undefined
                ) {
                  let idx = 0
                  if (entityCtx.creditorEntities[2]?.CreditorAccounts.length !== -1) {
                    // if (entityCtx.entities[0]?.Accounts.length !== -1) {
                    // idx = entityCtx.entities[0]?.Accounts.length - 1
                    idx = entityCtx.creditorEntities[2]?.CreditorAccounts.length - 1
                  }
                  await entityCtx.setCreditorAccountPacs008(2, idx)
                }
              }}
            />
            <CreditorProfile
              colour={!entityCtx.creditorEntities[3] ? "text-gray-300" : "text-orange-500"}
              reverse={true}
              entity={entityCtx.creditorEntities[3]?.CreditorEntity}
              creditorAccounts={entityCtx.creditorEntities[3]?.CreditorAccounts}
              setModalVisible={setModal}
              setSelectedEntity={() => setSelectedCreditorEntity(3)}
              index={3}
              selectedEntity={selectedCreditorEntity}
              addAccount={async () => {
                await entityCtx.createCreditorEntityAccount(3)
                if (
                  entityCtx.creditorEntities[3]?.CreditorAccounts.length !== -1 &&
                  entityCtx.creditorEntities[3]?.CreditorAccounts.length !== undefined
                ) {
                  let idx = 0
                  if (entityCtx.creditorEntities[3]?.CreditorAccounts.length !== -1) {
                    // if (entityCtx.entities[0]?.Accounts.length !== -1) {
                    // idx = entityCtx.entities[0]?.Accounts.length - 1
                    idx = entityCtx.creditorEntities[3]?.CreditorAccounts.length - 1
                  }
                  await entityCtx.setCreditorAccountPacs008(3, idx)
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 pt-10">
        {/* CRSP */}
        <div className="col-span-2 rounded-md shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
          <h2 className="mb-5 rounded-t-lg bg-gradient-to-r from-gray-100 to-gray-200 py-5 text-center uppercase shadow-lg">
            Event director
          </h2>

          <div className="flex min-h-80 items-center justify-center">
            <StatusIndicator large={true} colour={lights.ED.color} />
          </div>
        </div>

        {/* Rules */}
        <div className="col-span-4 rounded-lg shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
          <h2 className="mb-5 rounded-t-lg bg-gradient-to-r from-gray-100 to-gray-200 py-5 text-center uppercase shadow-lg">
            Rules
          </h2>
          <div className="grid grid-cols-12">
            <div className="col-span-6">
              <div className="grid grid-cols-3 px-5">
                {rules &&
                  rules?.map((rule: any) => (
                    <div
                      className={`mb-1 flex rounded-md px-2 hover:bg-gray-200 hover:shadow`}
                      key={`r-${rule.id}`}
                      onMouseEnter={() => {
                        handleRuleMouseEnter(rule.title)
                        console.log(rule.title)
                      }}
                      onMouseLeave={() => {
                        handleRuleMouseLeave()
                        console.log(rule)
                      }}
                    >
                      <StatusIndicator /> &nbsp;
                      {rule.title}
                    </div>
                  ))}
              </div>
            </div>
            <div className="col-span-6 px-5">
              <RuleResult />
            </div>
          </div>
        </div>

        {/* Typologies */}
        <div className="col-span-4 rounded-lg shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
          <h2 className="mb-5 rounded-t-lg bg-gradient-to-r from-gray-100 to-gray-200 py-5 text-center uppercase shadow-lg">
            Typologies
          </h2>

          <div className="grid grid-cols-12">
            <div className="col-span-6">
              <div className="grid grid-cols-3 px-5">
                {types &&
                  types.map((type: any) => (
                    <div className={`mb-1 flex rounded-md px-2 hover:bg-gray-200 hover:shadow`} key={`r-${type.id}`}>
                      <StatusIndicator /> &nbsp;
                      {type.title}
                    </div>
                  ))}
              </div>
            </div>
            <div className="col-span-6 px-5">
              <TypeResult />
            </div>
          </div>
        </div>

        {/* Tadproc */}
        <div className="col-span-2 rounded-lg shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
          <h2 className="mb-5 rounded-t-lg bg-gradient-to-r from-gray-100 to-gray-200 py-5 text-center uppercase shadow-lg">
            Tadproc
          </h2>

          <div className="flex min-h-80 items-center justify-center">
            <StatusIndicator large={true} />
          </div>
        </div>
      </div>
      <div className="flex min-h-80 w-full items-center justify-center"></div>

      {showModal && (
        <Modal
          colour={
            selectedEntity === 0
              ? "rgba(68, 114, 196, 1)"
              : selectedEntity === 1
              ? "rgba(112, 173, 71, 1)"
              : selectedEntity === 2
              ? "rgba(255, 192, 0, 1)"
              : "rgba(237, 125, 49, 1)"
          }
          showModal={showModal}
          setModal={setModal}
          entity={entityCtx.entities[selectedEntity]?.Entity}
          selectedEntity={selectedEntity}
        />
      )}
    </div>
  )
}

export default Web
