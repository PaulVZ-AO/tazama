import { Rule, TadProcLightsManager } from "./processor.interface"

export const ruleInitialState: Rule[] = []

export const defaultTadProcLights: TadProcLightsManager = {
  TADPROC: {
    result: null,
    color: "n",
    stop: false,
    status: "NALT",
  },
}
