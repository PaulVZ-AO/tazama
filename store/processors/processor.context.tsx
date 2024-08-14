import { createContext } from "react"
import { ruleInitialState, defaultTadProcLights } from "./processor.initialState"
import { Rule, TadProcLightsManager } from "./processor.interface"

interface Context {
  rulesLoading: boolean
  tadprocLoading: boolean
  rules: Rule[]
  tadpLights: TadProcLightsManager
  createRules: () => void
  updateRules: (rules: Rule[]) => void
  updateTadpLights: (data: TadProcLightsManager) => void
  resetAllLights: () => void
}

const ProcessorContext = createContext<Context>({
  rulesLoading: false,
  tadprocLoading: false,
  rules: ruleInitialState,
  tadpLights: defaultTadProcLights,
  createRules: () => {},
  updateRules: (rules: Rule[]) => {},
  updateTadpLights: () => {},
  resetAllLights: () => {},
})

export default ProcessorContext
