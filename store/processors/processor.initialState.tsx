import { EDLightsManager, Rule, TadProcLightsManager, Typology } from "./processor.interface"

export const ruleInitialState: Rule[] = []
export const typologiesInitialState: Typology[] = []

export const defaultTadProcLights: TadProcLightsManager = {
  TADPROC: {
    result: null,
    color: "n",
    stop: false,
    status: "NALT",
  },
}

export const defaultEDLights: EDLightsManager = {
  ED: {
    pacs008: false,
    pacs002: false,
    color: "n",
    error: "",
  },
}
