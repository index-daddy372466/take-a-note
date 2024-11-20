require("dotenv");
// declare vars
const fastify = require("fastify")({
  logger: false,
});
const fastifyView = require("@fastify/view");
const fastifyStatic = require("@fastify/static");
const rootpath = require("path").resolve(__dirname, "../public");
const PORT = process.env.PORT || 3001;
const fastconn = require("../db.js").fastconnection;

// middleware
fastify.register(fastifyStatic, {
  root: rootpath,
});
fastify.register(fastifyView, {
  engine: {
    ejs: require("ejs"),
  },
  root: rootpath,
});

fastify.register(require("@fastify/cookie"));
fastify.register(require("@fastify/session"), {
  secret: process.env.SECRET1,
  cookieName: "sessionId",
  cookie: { maxAge: 1800000, secure: false, httpOnly:true },
});

// routes
fastify.register(require("./lib/routes/home.js"));
fastify.register(require("./lib/routes/notes.js"));
// fastify.register(require('./lib/routes/abort.js'))
fastify.register(require("@fastify/postgres"), fastconn.fastPgConnection);

// fastify.addHook('preHandler',(req,res,done)=>{
//   const bufferId = Buffer.from(Date.now().toString(), "utf-8");
//   let base64 = bufferId.toString("base64");
//   // check for exisitng users
//     try{
//         req.session['id'] = base64
//         // addUerToDb(fastify,req.session['id'])
//         console.log(req.session['id'])
//     }
//     catch(err){
//       throw new Error(err)
//     }
//     // add id to database
//     // addUerToDb(fastify, base64);
//   // req.session.user = {id:base64}
//   done()
// })

// lisen on fastify server
fastify.listen({ port: PORT, host: `127.0.0.1` }, (err, address) => {
  return err
    ? listenErr(fastify, err)
    : console.log("fastify server is open on port: " + PORT);
});

// functions
function listenErr(fast, err) {
  console.log("server is not good");
  fast.log.error(err);
  process.exit(1);
}
function addUerToDb(fast, id) {
  try {
    fast.pg.query("insert into users(id) values($1)", [id], (err, result) => {
      return err ? console.log(err) : console.log("user inserted!");
    });
  } catch (err) {
    throw new Error(err);
  }
}
