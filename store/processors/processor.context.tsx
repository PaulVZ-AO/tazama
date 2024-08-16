import { createContext } from "react"
import { ruleInitialState, defaultTadProcLights, defaultEDLights } from "./processor.initialState"
import { EDLightsManager, Rule, TadProcLightsManager, Typology } from "./processor.interface"

interface Context {
  rulesLoading: boolean
  tadprocLoading: boolean
  edLightsLoading: boolean
  typologyLoading: boolean
  typologies: Typology[]
  edLights: EDLightsManager
  rules: Rule[]
  tadpLights: TadProcLightsManager
  createRules: () => void
  createTypologies: () => void
  updateRules: (rules: Rule[]) => void
  updateTypologies: (typologies: Typology[]) => void
  updateTadpLights: (data: TadProcLightsManager) => void
  updateEDLights: (data: EDLightsManager) => void
  resetAllLights: () => void
}

const ProcessorContext = createContext<Context>({
  rulesLoading: false,
  tadprocLoading: false,
  edLightsLoading: false,
  typologyLoading: false,
  edLights: defaultEDLights,
  rules: ruleInitialState,
  typologies: [],
  tadpLights: defaultTadProcLights,
  createRules: () => {},
  createTypologies: () => {},
  updateRules: (rules: Rule[]) => {},
  updateTypologies: (typologies: Typology[]) => {},
  updateEDLights: (data: EDLightsManager) => {},
  updateTadpLights: () => {},
  resetAllLights: () => {},
})

export default ProcessorContext
