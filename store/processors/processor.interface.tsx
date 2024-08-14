export interface Rule {
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
