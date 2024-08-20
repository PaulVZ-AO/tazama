const frms = require("@frmscoe/frms-coe-lib/lib/helpers/protobuf")
const NATS = require("nats")
const next = require("next")
require("dotenv").config()

const { Server } = require("socket.io")
const { createServer } = require("http")
const { parse } = require("url")

const app = next({ dev: process.env.NODE_ENV !== "production" })

const natsUrl = process.env.NEXT_PUBLIC_CMS_NATS_HOSTING

const port = process.env.PORT

const handle = app.getRequestHandler()

const sc = NATS.StringCodec()

const handleMsg = async (msg, socket, room) => {
  // let decodedMsg
  const subject = sc.decode(msg._msg.subject)
  console.log(subject)

  const decodedMessage = frms.default.decode(msg.data)
  console.log(decodedMessage)
  await socket.to(room).emit(room, decodedMessage)
}

const messageListener = async (messages, socket) => {
  ;(async () => {
    for await (const msg of messages) await handleMsg(msg, socket)
  })()
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(server, {
    transports: ["websocket", "polling"],
  })

  const NATSSubscriptions = []
  io.on("connect", (socket) => console.log("CONNECT", socket.id))
  let roomsList = [
    "welcome",
    "confirmation",
    "subscriptions",
    "ruleRequest",
    "ruleResponse",
    "typoRequest",
    "typoResponse",
    "tadProc",
    "stream",
  ]

  io.on("connection", async (socket) => {
    socket.join([...roomsList])
    console.log("Client connected", socket.id)
    socket.emit("welcome", { message: "NATS Connected" })

    socket.on("confirmation", (message) => {
      console.log("Confirmed:", message)
    })

    socket.on("subscriptions", (message) => {
      console.log("Subscriptions:", message)

      message.subscriptions.forEach((subscription) => {
        if (!NATSSubscriptions.includes(subscription)) {
          console.log("Adding subscription:", subscription)
          NATSSubscriptions.push(subscription)
        }
      })
    })

    socket.on("tadProc", (message) => {
      console.log("TADPROC Request:", message)
      // Emit message to all subscribed clients
      io.to("tadProc").emit("tadProc", message)
    })

    // Connect to NATS server
    const nc = await NATS.connect({
      servers: natsUrl,
    })

    let subscriptions = []

    NATSSubscriptions.forEach((sub) => {
      let subscription = nc.subscribe(sub, { queue: "MONITORING" })
      subscriptions.push(subscription)
      if (sub === ">") {
        console.log("Subscribed to all rules")
        socket.emit("subscriptions", `Subscribed to all rules`)
      } else {
        console.log("Subscribed to ", sub)
        socket.emit("subscriptions", `Subscribed to ${sub}`)
      }
    })

    console.log(nc.info)

    const connected = nc.subscribe("connection")
    const all = nc.subscribe(">", { queue: "MONITORING1" })
    const pubRule901 = nc.subscribe("pub-rule-901@1.0.0", { queue: "MONITORING_RULE_PUBLISHER" })
    const subRule901 = nc.subscribe("sub-rule-901@1.0.0", { queue: "MONITORING_RULE_SUBSCRIBER" })
    const type001 = nc.subscribe("typology-999@1.0.0", { queue: "MONITORING_TYPOLOGY" })
    const cms = nc.subscribe("CMS", { queue: "MONITORING_CMS" })

    // subscriptions.push(connected)
    // subscriptions.push(all)
    // // subscriptions.push(pubRule901)
    // // subscriptions.push(subRule901)
    // // subscriptions.push(cms)
    // subscriptions.push(type001)

    // subscriptions.forEach(async (sub) => {
    //   return await messageListener(sub, socket)
    // })

    ;(async () => {
      for await (const msg of connected) await handleMsg(msg, io, "connection")
    })()
    ;(async () => {
      for await (const msg of all) await handleMsg(msg, io, "stream")
    })()
    ;(async () => {
      for await (const msg of type001) await handleMsg(msg, io, "typoResponse")
    })()
    ;(async () => {
      for await (const msg of pubRule901) await handleMsg(msg, io, "ruleResponse")
    })()
    ;(async () => {
      for await (const msg of subRule901) await handleMsg(msg, io, "ruleRequest")
    })()
    ;(async () => {
      for await (const msg of cms) await handleMsg(msg, io, "tadProc")
    })()

    io.to("stream").emit("stream", { message: "Stream Test Message" })

    socket.on("disconnect", () => {
      console.log("Client disconnected")
    })
  })

  server.listen(3001, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
