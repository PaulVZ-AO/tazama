const NATS = require('nats');
const next = require('next');
const protobuf = require('protobufjs');
const { Server } = require("socket.io");
const { createServer } = require('http');
const { parse } = require('url');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);
  io.socketsJoin(['stream', 'welcome', 'confirmation'])
  io.setMaxListeners(0)

  io.on('connection', async (socket) => {
    console.log('Client connected', socket.id);
    // socket.join('stream')
    socket.emit('welcome', { message: 'NATS Connected' });
  
    socket.on('confirmation', (message) => {
      console.log("Confirmed:", message)
    });

    // Connect to NATS server
    const nc = await NATS.connect({
      servers: "localhost:14222"
    })

    const sc = NATS.StringCodec()

    console.log(nc.info)

    const connected = nc.subscribe("connection")
    const all = nc.subscribe(">", { queue: "MONITORING" })
    const pubRule901 = nc.subscribe("pub-rule-901@1.0.0", { queue: "MONITORING" })
    const subRule901 = nc.subscribe("sub-rule-901@1.0.0", { queue: "MONITORING" })
    const cms = nc.subscribe("cms", { queue: "MONITORING" })

    const type001 = nc.subscribe("typology-999@1.0.0", { queue: "MONITORING" })


    const handleMsg = async (msg) => {
      const subject = sc.decode(msg._msg.subject);
      const sid = msg._msg.sid
      console.log(subject, sid)
      protobuf.load("Full.proto", function (err, root) {
        if (err)
          throw err;

        let Message = root.lookupType("awesomepackage.FRMSMessage")

        let decodedMsg = Message.decode(msg.data).toJSON();
        console.log(`Connection Received a request: `, decodedMsg)
        console.log("---------------------------------------------------------------->")
        socket.emit('stream', decodedMsg );
      })
      
    }

    ;(async () => {
      for await (const msg of connected) await handleMsg(msg)
    })()

    ;(async () => {
      for await (const msg of all) await handleMsg(msg)
    })()

    ;(async () => {
      for await (const msg of type001) await handleMsg(msg)
    })()

    ;(async () => {
      for await (const msg of pubRule901) await handleMsg(msg)
    })()

    ;(async () => {
      for await (const msg of subRule901) await handleMsg(msg)
    })()
    ;(async () => {
      for await (const msg of cms) await handleMsg(msg)
    })()
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  
  
  server.listen(3001, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3001');
  });
});