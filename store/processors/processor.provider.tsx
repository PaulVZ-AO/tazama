"use client"
import React, { ReactNode, useEffect, useReducer, useContext } from "react"
import { io } from "socket.io-client"
import { ACTIONS } from "./processor.actions"
import ProcessorContext from "./processor.context"
import {
  ruleInitialState,
  defaultEDLights,
  defaultTadProcLights,
  typologiesInitialState,
} from "./processor.initialState"
import { EDLightsManager, Rule, TadProcLightsManager, Typology } from "./processor.interface"
import ProcessorReducer from "./processor.reducer"
import axios, { AxiosResponse } from "axios"
import { getTADPROCResult } from "utils/db"

interface Props {
  children: ReactNode
}

const ProcessorProvider = ({ children }: Props) => {
  const initialProcessorState = {
    rulesLoading: false,
    tadprocLoading: false,
    edLightsLoading: false,
    typologiesLoading: false,
    typologies: typologiesInitialState,
    edLights: defaultEDLights,
    rules: ruleInitialState,
    tadpLights: defaultTadProcLights,
  }
  const [state, dispatch] = useReducer(ProcessorReducer, initialProcessorState)

  useEffect(() => {
    createRules()
    createTypologies()
  }, [])

  useEffect(() => {
    const socket = io()

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
      await updateRules(msg)
    })

    socket.on("typoRequest", async (msg) => {
      console.log("Received Message from the TYPO REQUEST: ", msg)
    })

    socket.on("typoResponse", async (msg) => {
      console.log("Received Message from the TYPO RESPONSE: ", msg)
      await updateTypologies(msg)
    })

    socket.on("stream", async (msg) => {
      console.log("Received Message from the Stream: ", msg)
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
  }, [state.rules])

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

      // FIX THIS LOGIC AS PER DOCUMENTATION

      if (msg.ruleResult.subRuleRef === ".01") {
        updatedRules[index]!.color = "g"
      }
      if (msg.ruleResult.subRuleRef === ".02") {
        updatedRules[index]!.color = "y"
      }
      if (msg.ruleResult.subRuleRef === ".03") {
        updatedRules[index]!.color = "r"
      }

      dispatch({ type: ACTIONS.UPDATE_RULES_SUCCESS, payload: updatedRules })
      if (msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId !== undefined) {
        const results: any = await getTADPROCResult(msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
        console.log(results)
        updateTadpLights(results)
        // setTadpLights(results)
      }
    } catch (error: any) {
      dispatch({ type: ACTIONS.UPDATE_RULES_FAIL })
      console.error(error.message)
    }
  }

  const updateTypologies = async (msg: any) => {
    try {
      dispatch({ type: ACTIONS.UPDATE_TYPO_LOADING })
      console.log("TYPOLOGY: ", msg.typologyResult.cfg.split("@")[0], msg.typologyResult.result)
      const index: number = state.typologies.findIndex(
        (r: Typology) => r.title === msg.typologyResult.cfg.split("@")[0]
      )

      const updatedTypo: any[] = [...state.typologies]

      updatedTypo[index].result = msg.typologyResult.result

      // FIX THIS LOGIC AS PER DOCUMENTATION

      let interThreshold = msg.typologyResult.workflow.interdictionThreshold
      let alertThreshold = msg.typologyResult.workflow.alertThreshold

      if (msg.typologyResult.result >= alertThreshold) {
        updatedTypo[index].color = "r"
      }

      if (msg.typologyResult.result >= alertThreshold && msg.typologyResult.result < interThreshold) {
        updatedTypo[index].color = "y"
      }

      if (msg.typologyResult.result < alertThreshold) {
        updatedTypo[index].color = "g"
      }

      dispatch({ type: ACTIONS.UPDATE_TYPO_SUCCESS, payload: updatedTypo })
      if (msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId !== undefined) {
        const results: any = await getTADPROCResult(msg?.transaction?.FIToFIPmtSts?.GrpHdr?.MsgId)
        console.log(results)
        updateTadpLights(results)
      }
    } catch (error: any) {
      dispatch({ type: ACTIONS.UPDATE_TYPO_FAIL })
      console.error(error.message)
    }
  }

  const updateTadpLights = async (data: TadProcLightsManager) => {
    try {
      dispatch({ type: ACTIONS.UPDATE_TADPROC_LOADING })
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
      dispatch({ type: ACTIONS.UPDATE_ED_FAIL })
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
      }}
    >
      {children}
    </ProcessorContext.Provider>
  )
}

export default ProcessorProvider
