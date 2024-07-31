"use client"

import { StringCodec } from "nats.ws"
import { useNats, useNatsSubscribe } from "@/../hooks/use-nats"

const sc = StringCodec()

interface NatsComponentProps {
  servers: string
  subject?: string
}

export default function NatsComponent({ servers }: NatsComponentProps) {
  const nats = useNats(servers)
  const { lastMsg: all_lastMsg, msgs: all_msgs } = useNatsSubscribe(nats, ">")
  const { lastMsg: foo_lastMsg, msgs: foo_msgs } = useNatsSubscribe(nats, "TEST")
  const { lastMsg: bar_lastMsg, msgs: bar_msgs } = useNatsSubscribe(nats, "SERVER")
  return (
    <div className="m-4 flex flex-col items-center gap-4">
      <h2>Nats Component</h2>
      {nats ? <p>Connected to {nats.getServer()}</p> : <p> Not Connected</p>}
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          {all_lastMsg ? (
            <p>{`Last Message - subject: ${all_lastMsg.subject} - message: ${sc.decode(all_lastMsg.data)} `}</p>
          ) : (
            <p>
              No Last message on <span className="text-green-400">{">"}</span>
            </p>
          )}
          {all_msgs ? (
            all_msgs.map((msg, idx) => (
              <p key={idx}>{`Msg - subject: ${msg.subject} - message: ${sc.decode(msg.data)} `}</p>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col  items-center gap-1">
          {foo_lastMsg ? (
            <p>{`Last Message - subject: ${foo_lastMsg.subject} - message: ${sc.decode(foo_lastMsg.data)} `}</p>
          ) : (
            <p>
              {" "}
              No Last message on <span className="text-green-400">foo</span>
            </p>
          )}
          {foo_msgs ? (
            foo_msgs.map((msg, idx) => (
              <p key={idx}>{`Msg - subject: ${msg.subject} - message: ${sc.decode(msg.data)} `}</p>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col  items-center gap-1">
          {bar_lastMsg ? (
            <p>{`Last Message - subject: ${bar_lastMsg.subject} - message: ${sc.decode(bar_lastMsg.data)} `}</p>
          ) : (
            <p>
              {" "}
              No Last message on <span className="text-green-400">bar</span>
            </p>
          )}
          {bar_msgs ? (
            bar_msgs.map((msg, idx) => (
              <p key={idx}>{`Msg - subject: ${msg.subject} - message: ${sc.decode(msg.data)} `}</p>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}
