"use client"

import { connect, Msg, NatsConnection, StringCodec } from "nats.ws"
import { useCallback, useEffect, useRef, useState } from "react"

export type Message = Msg & { id: string }

export function useNats(servers: string) {
  const [nats, setNats] = useState<NatsConnection>()

  const setConnection = useCallback(async () => {
    const nc = await connect({ servers: servers })
    setNats(nc)
    console.log("connected to NATS on ", servers)
  }, [])

  const drain = useCallback(() => {
    nats?.drain()
    console.log("closed NATS connection")
  }, [])

  useEffect(() => {
    setConnection().catch(console.error)
    return drain
  }, [])

  return nats
}

export function useNatsSubscribe(nats: NatsConnection | undefined, subject: string) {
  const [lastMsg, setLastMsg] = useState<Message>()
  const [msgs, setMsgs] = useState<Message[]>([])

  useEffect(() => {
    if (nats) {
      const sub = nats.subscribe(subject)
      ;(async () => {
        for await (const msg of sub) {
          const m: Message = Object.assign(msg, { id: String(Math.floor(Math.random() * 1e12)) })
          setLastMsg(m)
          setMsgs((oldMsgs) => [...oldMsgs, m])
        }
      })()
    }
  }, [nats])

  return { lastMsg, msgs }
}
