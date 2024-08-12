import React, { useState, useEffect } from "react"
import { StatusIndicator } from "../StatusIndicator/StatusIndicator"

interface Props {
  started: boolean
}
export function ProcessIndicator({ started }: Props) {
  const [progress, setProgress] = useState<number | null>(null)

  useEffect(() => {
    if (started && progress === null) {
      setProgress(0)
    }
    if (started) {
      const len = 7
      const timer = setInterval(() => {
        if (progress! < len) {
          setProgress((prevProgress) => prevProgress! + 1)
        } else {
          setProgress(0)
        }
      }, 100)

      return () => clearInterval(timer)
    } else {
      setProgress(null)
    }
  }, [progress, started])
  return (
    <>
      <StatusIndicator colour={progress === 0 ? "g" : "n"} />
      <StatusIndicator colour={progress === 1 ? "g" : "n"} />
      <StatusIndicator colour={progress === 2 ? "g" : "n"} />
      <StatusIndicator colour={progress === 3 ? "g" : "n"} />
      <StatusIndicator colour={progress === 4 ? "g" : "n"} />
      <StatusIndicator colour={progress === 5 ? "g" : "n"} />
      <StatusIndicator colour={progress === 6 ? "g" : "n"} />
      <StatusIndicator colour={progress === 7 ? "g" : "n"} />
    </>
  )
}
