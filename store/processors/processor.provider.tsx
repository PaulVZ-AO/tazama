"use client"

import axios, { AxiosResponse } from "axios"
import dotenv, { config } from "dotenv"
import React, { ReactNode, useEffect, useReducer, useState } from "react"
import { io } from "socket.io-client"
import { uiConfigInitialState } from "store/entities/entity.initialState"
import { getNetworkMap, getTADPROCResult } from "utils/db"
import { ACTIONS } from "./processor.actions"
import ProcessorContext from "./processor.context"
import {
  defaultEDLights,
  defaultTadProcLights,
  ruleInitialState,
  typologiesInitialState,
} from "./processor.initialState"
import {
  DBConfig,
  EDLightsManager,
  Rule,
  RuleBand,
  TADPROC,
  TADPROC_RESULT,
  Typology,
  UI_CONFIG,
} from "./processor.interface"
import ProcessorReducer from "./processor.reducer"

dotenv.config()

interface Props {
  children: ReactNode
}

const ProcessorProvider = ({ children }: Props) => {
  const initialProcessorState = {
    rulesLoading: false,
    tadprocLoading: false,
    edLightsLoading: false,
    edError: "",
    typologiesLoading: false,
    typologies: typologiesInitialState,
    rules: ruleInitialState,
    edLights: defaultEDLights,
    tadpLights: defaultTadProcLights,
  }
  const [state, dispatch] = useReducer(ProcessorReducer, initialProcessorState)

  const [uiConfig, setUiConfig] = useState<any>(null)
  const [wsAddress, setWsAddress] = useState<any>(null)

  const getUIConfig = async () => {
    if (localStorage.getItem("UI_CONFIG") !== null) {
      const config: any = await localStorage.getItem("UI_CONFIG")
      return config
    } else {
      await localStorage.setItem("UI_CONFIG", JSON.stringify(uiConfigInitialState))
      return JSON.stringify(uiConfigInitialState)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (wsAddress === null) {
        if (uiConfig !== null) {
          setWsAddress(uiConfig.wsIpAddress)
        }
      }
    })()
  }, [uiConfig])

  useEffect(() => {
    if (uiConfig === null) {
      ;(async () => {
        let config = await getUIConfig()
        if (uiConfig !== undefined) {
          setUiConfig(JSON.parse(config))
        }
      })()
    }
  }, [uiConfig])

  useEffect(() => {
    ;(async () => {
      let conf: any = await getUIConfig()
      let con: any = JSON.parse(conf)
      const config: any = {
        url: con.arangoDBHosting,
        databaseName: "configuration",
        auth: { username: con.dbUser, password: con.dbPassword },
      }
      const configData = await getNetworkMap(config)
      if (configData.rules) {
        dispatch({ type: ACTIONS.CREATE_RULES_SUCCESS, payload: configData.rules })
      }
      if (configData.typologies) {
        dispatch({ type: ACTIONS.CREATE_TYPO_SUCCESS, payload: configData.typologies })
      }
    })()
  }, [])

  const WS_URL = wsAddress

  useEffect(() => {
    if (WS_URL !== undefined) {
      const socket = io(WS_URL, {
        transports: ["websocket"],
      })

      socket.on("connection", (msg: any) => {
        // console.log("Connected to WebSocket server", msg)
        // console.log("SENDING SETTINGS")
      })
      socket.emit("uiconfig", uiConfig)

      socket.emit("subscriptions", { subscriptions: ["connection", ">", "typology-processor@1.0.0", "cms"] })

      socket.on("welcome", (msg: any) => {
        // console.log("Received Message from the welcome: ", msg)
        socket.emit("confirmation", msg)
      })

      // socket.on("ruleRequest", (msg) => {
      //   console.log("Received Message from the RULE REQUEST: ", msg)
      // })

      // socket.on("ruleResponse", (msg) => {
      //   console.log("Received Message from the RULE RESPONSE: ", msg)
      //   setTimeout(async () => await updateRules(msg), 400)
      // })

      // socket.on("typoRequest", (msg) => {
      //   console.log("Received Message from the TYPO REQUEST: ", msg)
      // })

      // socket.on("typoResponse", (msg) => {
      //   console.log("Received Message from the TYPO RESPONSE: ", msg)
      //   setTimeout(async () => await updateTypologies(msg), 700)
      //   // ;(async () => {
      //   //   const results: any = await getTADPROCResult(msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
      //   //   await updateTadpLights(results)
      //   // })()

      //   socket.emit("tadProc", msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
      // })

      // socket.on("stream", (msg) => {
      //   console.log("Received Message from the Stream: ", msg)
      // })

      socket.on("tadProc", async (msg: any) => {
        // console.log("Received Message from the TADPROC: ", msg)
        // if (msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId !== undefined) {
        setTimeout(async () => {
          let conf: any = await localStorage.getItem("UI_CONFIG")
          let con: any = JSON.parse(conf)
          const config: any = {
            url: con.arangoDBHosting,
            databaseName: "configuration",
            auth: { username: con.dbUser, password: con.dbPassword },
          }

          const results: any = await getTADPROCResult(msg, config)
          await updateTadpLights(results)
        }, 1000)
        // setTimeout(async () => await updateTadpLights(results), 200)

        // }
      })

      socket.on("subscriptions", (msg: any) => {
        // console.log(msg)
      })

      socket.onAny((event: any, ...args: any) => {
        const ruleResult = Object.keys(args[0]).includes("ruleResult")
        const typoResult = Object.keys(args[0]).includes("typologyResult")

        if (ruleResult) {
          setTimeout(async () => await updateRules(args[0]), Math.floor(Math.random() * (500 - 200 + 100)) + 200)
        }
        if (typoResult) {
          setTimeout(
            async () => {
              await updateTypologies(args[0])
            },
            Math.floor(Math.random() * (1000 - 400 + 100)) + 400
          )
          socket.emit("tadProc", args[0]?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
        }
      })

      socket.on("disconnect", () => {
        // console.log("Disconnected from WebSocket server")
      })

      return () => {
        if (socket.disconnected) {
          socket.active
        }
        socket.close()
      }
    }
  }, [state.rules, state.typologies, uiConfig])

  const createRules = async () => {
    try {
      dispatch({ type: ACTIONS.CREATE_RULES_LOADING })
      const res: AxiosResponse = await axios.get("api/rules")
      dispatch({ type: ACTIONS.CREATE_RULES_SUCCESS, payload: res.data.rules.rule })
    } catch (error: any) {
      dispatch({ type: ACTIONS.CREATE_RULES_FAIL })
      console.error(error.message)
    }
  }

  const createTypologies = async () => {
    try {
      dispatch({ type: ACTIONS.CREATE_TYPO_LOADING })
      const res: AxiosResponse = await axios.get("api/typologies")
      dispatch({ type: ACTIONS.CREATE_TYPO_SUCCESS, payload: res.data.types.type })
    } catch (error: any) {
      dispatch({ type: ACTIONS.CREATE_TYPO_FAIL })
      console.error(error.message)
    }
  }

  const updateRules = async (msg: any) => {
    try {
      dispatch({ type: ACTIONS.UPDATE_RULES_LOADING })
      const index: number = state.rules.findIndex((r: Rule) => r.title === msg.ruleResult.id.split("@")[0])

      const updatedRules: any[] = [...state.rules]

      updatedRules[index].result = msg.ruleResult.subRuleRef
      updatedRules[index]!.color = "g"

      // FIX THIS LOGIC AS PER DOCUMENTATION

      // if (msg.ruleResult.subRuleRef === ".01") {
      //   updatedRules[index]!.color = "g"
      // }
      // if (msg.ruleResult.subRuleRef === ".02") {
      //   updatedRules[index]!.color = "y"
      // }
      // if (msg.ruleResult.subRuleRef === ".03") {
      //   updatedRules[index]!.color = "r"
      // }

      if (msg.ruleResult.subRuleRef === ".err") {
        const idx: number = updatedRules[index].ruleBands.findIndex(
          (r: RuleBand) => r.subRuleRef === msg.ruleResult.subRuleRef
        )

        let errorBand: RuleBand = {
          subRuleRef: ".err",
          reason: msg.ruleResult.reason,
          lowerLimit: null,
          upperLimit: null,
        }
        if (idx !== -1) {
          updatedRules[index].ruleBands[idx].reason = msg.ruleResult.reason
        } else {
          updatedRules[index].ruleBands.push(errorBand)
        }

        // const updatedRules: any[] = [...state.rules]
        updatedRules[index]!.color = "r"
      }

      dispatch({ type: ACTIONS.UPDATE_RULES_SUCCESS, payload: updatedRules })
      // if (msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId !== undefined) {
      //   const results: any = await getTADPROCResult(msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
      //   console.log(results)
      //   updateTadpLights(results)
      //   // setTadpLights(results)
      // }
    } catch (error: any) {
      dispatch({ type: ACTIONS.UPDATE_RULES_FAIL })
      console.error(error.message)
    }
  }

  const updateTypologies = async (msg: any) => {
    try {
      dispatch({ type: ACTIONS.UPDATE_TYPO_LOADING })
      const index: number = state.typologies.findIndex(
        (r: Typology) => r.title === msg.typologyResult.cfg.split("@")[0]
      )

      const updatedTypo: any[] = [...state.typologies]

      updatedTypo[index].result = msg.typologyResult.result

      // FIX THIS LOGIC AS PER DOCUMENTATION
      let interThreshold = null
      let alertThreshold = null

      if (Object.keys(msg?.typologyResult?.workflow).includes("interdictionThreshold")) {
        interThreshold = msg.typologyResult.workflow.interdictionThreshold
      }

      if (Object.keys(msg?.typologyResult?.workflow).includes("alertThreshold")) {
        alertThreshold = msg.typologyResult.workflow.alertThreshold
      }
      // if (msg?.typologyResult?.workflow?.interdictionThreshold !== undefined) {

      // }
      // if (msg?.typologyResult?.workflow?.interdictionThreshold !== undefined) {
      //   alertThreshold = msg.typologyResult.workflow.alertThreshold
      // }

      updatedTypo[index].color = "g"

      if (alertThreshold !== null && interThreshold !== null) {
        if (msg.typologyResult.result < alertThreshold) {
          updatedTypo[index].color = "g"
        } else if (msg.typologyResult.result >= alertThreshold && msg.typologyResult.result < interThreshold) {
          updatedTypo[index].color = "y"
        } else if (msg.typologyResult.result >= interThreshold) {
          updatedTypo[index].color = "r"
          updatedTypo[index].stop = true
        }
      } else if (alertThreshold !== null && interThreshold === null) {
        if (msg.typologyResult.result < alertThreshold) {
          updatedTypo[index].color = "g"
        } else if (msg.typologyResult.result >= alertThreshold) {
          updatedTypo[index].color = "y"
        }
      } else {
        console.log("Error", msg.typologyResult)
        if (msg.typologyResult.result < 0) {
          updatedTypo[index].color = "y"
        }
      }

      dispatch({ type: ACTIONS.UPDATE_TYPO_SUCCESS, payload: updatedTypo })
    } catch (error: any) {
      dispatch({ type: ACTIONS.UPDATE_TYPO_FAIL })
      console.error(error.message)
    }
  }

  const validateResults = async (result: TADPROC_RESULT) => {
    try {
      dispatch({ type: ACTIONS.VALIDATE_RESULTS_LOADING })
      result.ruleResults.forEach((ruleResult) => {
        const index: number = state.rules.findIndex((r: Rule) => r.title === ruleResult.id.split("@")[0])
        const updatedRules: any[] = [...state.rules]
        if (ruleResult.wght > 0) {
          updatedRules[index].color = "r"
        }
      })

      dispatch({ type: ACTIONS.VALIDATE_RESULTS_SUCCESS, payload: null })
    } catch (error) {
      dispatch({ type: ACTIONS.VALIDATE_RESULTS_FAIL })
    }
  }

  const updateTadpLights = async (data: TADPROC) => {
    try {
      dispatch({ type: ACTIONS.UPDATE_TADPROC_LOADING })
      await data.results.forEach(async (result) => {
        await validateResults(result)
      })

      dispatch({ type: ACTIONS.UPDATE_TADPROC_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: ACTIONS.UPDATE_TADPROC_FAIL })
    }
  }

  const updateEDLights = async (data: EDLightsManager) => {
    try {
      dispatch({ type: ACTIONS.UPDATE_ED_LOADING })
      dispatch({ type: ACTIONS.UPDATE_ED_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: ACTIONS.UPDATE_ED_FAIL, payload: data })
    }
  }

  const resetAllLights = async () => {
    dispatch({ type: ACTIONS.RESET_ALL_LIGHTS })
  }

  return (
    <ProcessorContext.Provider
      value={{
        rulesLoading: false,
        tadprocLoading: false,
        edLightsLoading: false,
        typologyLoading: false,
        typologies: state.typologies,
        edLights: state.edLights,
        rules: state.rules,
        tadpLights: state.tadpLights,
        createRules,
        createTypologies,
        updateRules,
        updateTypologies,
        updateTadpLights,
        updateEDLights,
        resetAllLights,
        getUIConfig,
      }}
    >
      {children}
    </ProcessorContext.Provider>
  )
}

export default ProcessorProvider
