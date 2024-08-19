interface RuleBand {
  subRuleRef: string
  lowerLimit: number | null
  upperLimit: number | null
  reason: string
}

export interface Rule {
  id: number
  title: string
  rule: string
  ruleDescription: string
  color: "r" | "g" | "y" | "n"
  result: any
  linkedTypologies: string[]
  ruleBands: RuleBand[]
}

export interface Typology {
  id: number
  title: string
  color: "r" | "g" | "y" | "n"
  result: any
  linkedRules: string[]
}

export interface TadProcLightsManager {
  TADPROC: {
    result: any
    color: "r" | "g" | "y" | "n"
    stop: boolean
    status: string
  }
}

export interface EDLightsManager {
  ED: {
    pacs008: boolean
    pacs002: boolean
    color: "r" | "g" | "y" | "n"
    error: string
  }
}

export interface RuleConfig {
  id: string
  title: string
  description: string
  bands: RuleBand[]
}
