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
fastify.addHook("preHandler", async (req, res) => {
  const client = await fastify.pg.connect();

    const bufferId = Buffer.from(Date.now().toString(), "utf-8");
    let base64 = bufferId.toString("base64");
  // check for exisitng users
  //  let decodeId = Buffer.from(base64,'base64').toString()
   if(!req.session.user && !(await checkExistingUsers(client,base64))){
    req.session.user = {id:base64,active:true,expired:false}
    addUerToDb(client,base64)
   } else if(req.session && (await checkExistingUsers(client,req.session.user.id))){
    console.log('session is active and captured')
   } else {
    console.log('idk what to tell you')
   }
   
   // check expired user
    const id = (req.session.user.id);
    let decodeid = Buffer.from(id,'base64').toString()
    let time = new Date(+decodeid).getTime()
    let expires = Math.ceil((Date.now() - time) / 1000);
    let expTime = 1800
    if(expires >= expTime){
      // remove id from db
      await RemoveFromDb(client,req.session.user['id'])
      // destroy session
      req.session.destroy();
    }
});

// notes route
fastify.post("/note", async (req, res) => {
  const client = await fastify.pg.connect()
  const { note } = req.body;
  // notes.push({note:note,time:Date.now()})
  await client.query(
    "insert into notepad(notes,user_id) values($1,$2)",
    [{ note: note }, req.session.user.id]);
  res
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({ note: note });
});
fastify.get("/note", async (req, res) => {
  try {
    const client = await fastify.pg.connect()
    const notes = await client.query(
      "select * from notepad where user_id=$1",
      [req.session.user.id])
    const notesarr = notes.rows;
    res.code(200)
    .headers('Content-Type/application/json','charset=utf-8')
    .send({notes:notesarr.length<1 ? undefined : notesarr})
    
  } catch (err) {
    throw new Error(err);
  }
});

// routes
// fastify.register(require("./lib/routes/home.js"));
// fastify.register(require("./lib/routes/notes.js"));

// home route
fastify.get("/", async (req, res) => {
  try{
    return res.viewAsync("index.ejs");
  }
  catch(err){
    console.log(err)
    throw new Error(err)
  }
});
async function checkExistingUsers(client, id) {
  // check for exisitng users
  let released = await client.query("select * from users where id=$1",[id])
  client.release()
  console.log(released.rows)
  return released.rows.length > 0
}
async function addUerToDb(client, id) {
  try {
    // add user
    await client.query("insert into users(id) values($1)", [id])
  } catch (err) {
    throw new Error(err);
  }
}
async function RemoveFromDb(client,id){
  // destroy session
  await client.query('delete from users where id = $1',[id])
}


















fastify.register(require('./lib/routes/abort.js'))
fastify.register(require("@fastify/postgres"), fastconn.fastPgConnection);

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
