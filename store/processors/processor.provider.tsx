"use client"

import axios, { AxiosResponse } from "axios"
import dotenv from "dotenv"
import React, { ReactNode, useEffect, useReducer, useRef, useState } from "react"
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
import { Socket } from "socket.io"
import getNetworkMapSetup from "./networkMap"

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
    tadProcResults: defaultTadProcLights,
  }
  const [state, dispatch] = useReducer(ProcessorReducer, initialProcessorState)

  const [uiConfig, setUiConfig] = useState<any>(null)
  const [socket, setSocket] = useState<Socket>()
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [wsAddress, setWsAddress] = useState<string | null>(null)

  const msgId: any = useRef("")

  // const handleTadProc = async (msg: any) => {
  //   // console.log("THIS", state.tadProcResults)

  //   const config: any = {
  //     url: uiConfig.arangoDBHosting,
  //     databaseName: "configuration",
  //     auth: { username: uiConfig.dbUser, password: uiConfig.dbPassword },
  //   }
  //   const results: TADPROC | undefined = await getTADPROCResult(msg, config)

  //   if (results !== undefined) {
  //     console.log("THIS", state)
  //     dispatch({ type: ACTIONS.SET_TADPROC_RESULTS, payload: results })
  //   }
  // }

  useEffect(() => {
    const test = { ...state.tadProcResults }

    if ("results" in test) {
      console.log("TADPROC", state.tadProcResults.results.length)
      if (test.results.length > 0) {
        updateTadpLights(state.tadProcResults)
      }
    }
  }, [state.tadProcResults])

  useEffect(() => {
    if (wsAddress === null) {
      if (uiConfig !== null) {
        setWsAddress(uiConfig.wsIpAddress)
      }
    }
  }, [uiConfig])

  useEffect(() => {}, [state.rules])

  useEffect(() => {
    // Step 1: Initialize socket connection
    const newSocket: any = io(wsAddress!, {
      reconnectionAttempts: 5, // Custom reconnection attempts
      reconnectionDelay: 3000, // Delay in milliseconds between reconnections
    })

    setSocket(newSocket)

    // Step 2: Handle connection established
    newSocket.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)
    })
    // newSocket.emit("subscriptions", { subscriptions: ["connection", ">", "typology-processor@1.0.0", "cms"] })
    newSocket.on("welcome", (msg: any) => {
      // console.log("Received Message from the welcome: ", msg)
      newSocket.emit("confirmation", msg)
    })

    // Step 3: Handle disconnection
    newSocket.on("disconnect", (reason: any) => {
      console.log("Socket disconnected:", reason)
      setIsConnected(false)
    })

    // Step 4: Handle reconnection attempt
    newSocket.on("reconnect_attempt", (attemptNumber: number) => {
      console.log(`Reconnection attempt #${attemptNumber}`)
    })

    // Step 5: Handle incoming messages
    newSocket.on("message", (data: string) => {
      console.log("Received message:", data)
      // setMessages((prevMessages) => [...prevMessages, data])
    })

    // Step 6: Cleanup socket connection on unmount
    return () => {
      newSocket.disconnect()
    }
  }, [wsAddress])

  useEffect(() => {
    if (socket !== undefined) {
      socket.emit("uiconfig", uiConfig)
      socket.emit("subscriptions", { subscriptions: ["connection", ">", "typology-processor@1.0.0", "cms"] })
    }
  }, [isConnected])

  useEffect(() => {
    if (socket !== undefined) {
      socket.onAny((event: any, ...args: any) => {
        console.log("EVENT: ", event)
        const ruleResult = Object.keys(args[0]).includes("ruleResult")
        const typoResult = Object.keys(args[0]).includes("typologyResult")

        if (ruleResult) {
          console.log("EVENT RULES")
          setTimeout(async () => await updateRules(args[0]), Math.floor(Math.random() * (300 - 10)) + 10)
        }
        if (typoResult) {
          setTimeout(
            async () => {
              console.log("EVENT TYPOS")
              await updateTypologies(args[0])
            },
            Math.floor(Math.random() * (400 - 200)) + 200
          )

          if (msgId.current !== args[0]?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId) {
            msgId.current = args[0]?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId
            // socket.emit("tadProc", args[0]?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
          }
          // setMsgId({ id: args[0]?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId, socket: socket })
          // socket.emit("tadProc", args[0]?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
          // }
        }
      })
    }
  }, [state.rules, state.typologies])

  const handleTadProc = async (msg: any) => {
    const configData: any = await localStorage.getItem("UI_CONFIG")
    console.log(configData)
    let conf: any = configData
    let con: any = JSON.parse(conf)
    const config: any = {
      url: con.arangoDBHosting,
      databaseName: "configuration",
      auth: { username: con.dbUser, password: con.dbPassword },
    }
    try {
      let results: TADPROC | undefined = undefined
      while (results === undefined) {
        results = await getTADPROCResult(msg, config)
      }
      console.log("THIS HIT", results)
      if (results !== undefined) {
        dispatch({ type: ACTIONS.SET_TADPROC_RESULTS, payload: results })
      }
    } catch (err) {
      console.log("THIS HIT", err)
    }
  }

  useEffect(() => {
    console.log(state.tadProcResults)
  }, [state.tadProcResults])

  useEffect(() => {
    console.log("MSG_ID CHANGED", msgId.current)
    if (msgId.current !== "") {
      setTimeout(async () => {
        console.log("MSG_ID FETCHING", msgId.current)
        await handleTadProc(msgId.current)
        msgId.current = ""
      }, 500)
    }
  }, [msgId.current])

  // useEffect(() => {
  //   if (socket !== undefined) {
  //     socket.on("tadProc", async (msg: any) => {
  //       if (msgId.current !== msg) {
  //         console.log("MSG_ID: ", msg)
  //         msgId.current = msg
  //         setTimeout(async () => {
  //           await handleTadProc(msgId.current)
  //           msgId.current = ""
  //         }, 2000)
  //       }
  //     })
  //   }
  // }, [state.tadProcResults, socket])

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
    console.log("State Rules", state.rules)
  }, [state.rules])

  const createUIFromNetworkMap = async () => {
    let conf: any = await getUIConfig()
    let con: any = JSON.parse(conf)

    const config: any = {
      url: con.arangoDBHosting,
      databaseName: "configuration",
      auth: { username: con.dbUser, password: con.dbPassword },
    }
    try {
      // const configData = await getNetworkMap(config)
      const configData = await getNetworkMapSetup()
      console.log("CONFIG: ", configData)
      if (configData.rules) {
        dispatch({ type: ACTIONS.CREATE_RULES_SUCCESS, payload: configData.rules })
      }
      if (configData.typologies) {
        dispatch({ type: ACTIONS.CREATE_TYPO_SUCCESS, payload: configData.typologies })
      }
    } catch (err) {
      console.log("ERROR CREATING RULES: ", err)
    }
  }

  useEffect(() => {
    console.log(state.rules.length, state.typologies.length)
    if (state.rules.length === 0 || state.typologies.length === 0) {
      createUIFromNetworkMap()
    }
  }, [state.rules, state.typologies])

  // useEffect(() => {
  //   ;(async () => {
  //     if (wsAddress !== null) {
  //       const socket = io(wsAddress, {
  //         transports: ["websocket"],
  //       })

  //       socket.on("connection", (msg: any) => {
  //         // console.log("Connected to WebSocket server", msg)
  //         // console.log("SENDING SETTINGS")
  //       })
  //       socket.emit("uiconfig", uiConfig)

  //       socket.emit("subscriptions", { subscriptions: ["connection", ">", "typology-processor@1.0.0", "cms"] })

  //       socket.on("welcome", (msg: any) => {
  //         // console.log("Received Message from the welcome: ", msg)
  //         socket.emit("confirmation", msg)
  //       })

  //       // socket.on("ruleRequest", (msg) => {
  //       //   console.log("Received Message from the RULE REQUEST: ", msg)
  //       // })

  //       // socket.on("ruleResponse", (msg) => {
  //       //   console.log("Received Message from the RULE RESPONSE: ", msg)
  //       //   setTimeout(async () => await updateRules(msg), 400)
  //       // })

  //       // socket.on("typoRequest", (msg) => {
  //       //   console.log("Received Message from the TYPO REQUEST: ", msg)
  //       // })

  //       // socket.on("typoResponse", (msg) => {
  //       //   console.log("Received Message from the TYPO RESPONSE: ", msg)
  //       //   setTimeout(async () => await updateTypologies(msg), 700)
  //       //   // ;(async () => {
  //       //   //   const results: any = await getTADPROCResult(msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
  //       //   //   await updateTadpLights(results)
  //       //   // })()

  //       //   socket.emit("tadProc", msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
  //       // })

  //       // socket.on("stream", (msg) => {
  //       //   console.log("Received Message from the Stream: ", msg)
  //       // })

  //       socket.on("tadProc", async (msg: any) => {
  //         // if (msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId !== undefined) {
  //         // await handleTadProc(msg)
  //         let conf: any = await localStorage.getItem("UI_CONFIG")
  //         let con: any = JSON.parse(conf)
  //         const config: any = {
  //           url: con.arangoDBHosting,
  //           databaseName: "configuration",
  //           auth: { username: con.dbUser, password: con.dbPassword },
  //         }

  //         const results: TADPROC | undefined = await getTADPROCResult(msg, config)

  //         console.log("RESULTS: ", results)
  //         if (results !== undefined) {
  //           await updateTadpLights(results)
  //         }

  //         // await updateTadpLights(results)

  //         // setTimeout(async () => await updateTadpLights(results), 200)

  //         // }
  //       })

  //       socket.on("subscriptions", (msg: any) => {
  //         // console.log(msg)
  //       })

  //       socket.onAny((event: any, ...args: any) => {
  //         const ruleResult = Object.keys(args[0]).includes("ruleResult")
  //         const typoResult = Object.keys(args[0]).includes("typologyResult")

  //         if (ruleResult) {
  //           setTimeout(async () => await updateRules(args[0]), Math.floor(Math.random() * (1000 - 500)) + 500)
  //         }
  //         if (typoResult) {
  //           setTimeout(
  //             async () => {
  //               await updateTypologies(args[0])
  //             },
  //             Math.floor(Math.random() * (800 - 400)) + 400
  //           )
  //           // setMsgId({ id: args[0]?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId, socket: socket })
  //           socket.emit("tadProc", args[0]?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
  //           // }
  //         }
  //       })

  //       socket.on("disconnect", () => {
  //         // console.log("Disconnected from WebSocket server")
  //         return socket.active
  //       })

  //       return () => {
  //         if (socket.disconnected) {
  //           return socket.active
  //         }
  //         socket.close()
  //       }
  //     }
  //   })()
  //   // } else {
  //   //   console.log("WebSocket address not set")
  // }, [state.rules, state.typologies, uiConfig, wsAddress])

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
      const index: number = await state.rules.findIndex((r: Rule) => r.title === msg.ruleResult.id.split("@")[0])
      console.log(index)
      const updatedRules: any[] = [...state.rules]

      updatedRules[index].result = msg.ruleResult.subRuleRef
      updatedRules[index].color = "g"

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
        const idx: number = await updatedRules[index].ruleBands.findIndex(
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
      console.log("UPDATED RULES: ", updatedRules)
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
      }
      if (alertThreshold !== null && interThreshold === null) {
        if (msg.typologyResult.result < alertThreshold) {
          updatedTypo[index].color = "g"
        } else if (msg.typologyResult.result >= alertThreshold) {
          updatedTypo[index].color = "y"
        }
      } else {
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
        // console.log("RULEZ: ", state.rules)
        // await result.ruleResults.forEach(async (ruleResult) => {
        //   const index: number = await updatedRules.findIndex((r: Rule) => r.title === ruleResult.id.split("@")[0])
        //   console.log("rule Index: ", index)

        if (ruleResult.wght > 0) {
          updatedRules[index].color = "r"
        }
        // if (index !== -1) {
        //   if (ruleResult.wght > 0) {
        //     updatedRules[index].color = "r"
        //     updatedRules[index].wght = ruleResult.wght
        //   }
        // }
      })

      dispatch({ type: ACTIONS.VALIDATE_RESULTS_SUCCESS, payload: null })
    } catch (error) {
      dispatch({ type: ACTIONS.VALIDATE_RESULTS_FAIL })
    }
  }

  const updateTadpLights = async (data: TADPROC) => {
    const resIndex: any[] = []

    try {
      dispatch({ type: ACTIONS.UPDATE_TADPROC_LOADING })
      await data.results.forEach(async (result) => {
        result.ruleResults.map(async (ruleResult) => {
          const index: number = await state.rules.findIndex((r: Rule) => r.title === ruleResult.id.split("@")[0])
          if (index !== -1) {
            if (ruleResult.wght > 0) {
              state.rules[index].color = "r"
              state.rules[index].wght = ruleResult.wght

              // if (!resIndex.includes(index)) {
              //   resIndex.push({ index: index, wght: ruleResult.wght })
              // }
            }
          }
        })
      })
      // resIndex.forEach(async (item) => {
      //   setTimeout(() => {
      //     state.rules[item.index].color = "r"
      //     state.rules[item.index].wght = item.wght
      //   }, 100)
      // })

      dispatch({ type: ACTIONS.UPDATE_TADPROC_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: ACTIONS.UPDATE_TADPROC_FAIL })
      console.log("ERR HERE: ", error)
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
        tadProcResults: state.tadprocResults,
        msgId: msgId,
        createRules,
        createTypologies,
        updateRules,
        updateTypologies,
        updateTadpLights,
        updateEDLights,
        resetAllLights,
        getUIConfig,
        handleTadProc,
      }}
    >
      {children}
    </ProcessorContext.Provider>
  )
}

export default ProcessorProvider
