export interface Rule {
  id: number
  title: string
  color: "r" | "g" | "y" | "n"
  result: any
}

export interface Typology {
  id: number
  title: string
  color: "r" | "g" | "y" | "n"
  result: any
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
  }
}
