require("dotenv").config();
// declare vars
const fastify = require("fastify")({
  logger: false,
});
const fastifyView = require("@fastify/view");
const fastifyStatic = require("@fastify/static");
const rootpath = require("path").resolve(__dirname, "../public");
const PORT = process.env.PORT || 3001;
const fastconn = require("../db.js").fastconnection;
const {createHmac, randomBytes, createCipheriv, createDecipheriv} = require('crypto')
const keysExist = require('fs').existsSync(require('path').join(__dirname,'lib/encryption/rsa'))
let publicKey,key
if(!keysExist){
  // require('./lib/writefile.js')('writefile')
  publicKey = process.env.FAKE_PUBLIC_KEY
  key = Buffer.alloc(32,createHmac('sha256',process.env.SECRET).update(publicKey).digest('base64'))
} else {
  publicKey = require('fs').readFileSync(require('path').join(__dirname,'lib/encryption/rsa/id_rsa_pub.pem'),{encoding:'utf8'})
  key = Buffer.alloc(32,createHmac('sha256',process.env.SECRET).update(publicKey).digest('base64'))
}



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
// notes post route
fastify.post("/note", async (req, res) => {
  req.session.user['vi'] = randomBytes(16).toString('base64')
  const client = await fastify.pg.connect()
  const { note } = req.body;
  const encryptNote = encodeData(note,key,'aes-256-gcm',req.session.user['vi']) // data, key, algorithm
  console.log(encryptNote)
  // test encode note
  // notes.push({note:note,time:Date.now()})
  await client.query(
    "insert into notepad(notes,user_id) values($1,$2)",
    [{ note: encryptNote, iv: req.session.user['vi'].toString() }, req.session.user.id]);
  if(req.session.user){
    res
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({ note: decodeData(encryptNote,key,'aes-256-gcm',req.session.user['vi']) });
  };
})
// notes get route
fastify.get("/note", async (req, res) => {
  try {
    const client = await fastify.pg.connect()
    const notes = await client.query(
      "select notes from notepad where user_id=$1",
      [req.session.user.id])
    // decode the list of encoded notes with it's perspective iv
    const notesarr = [...notes.rows].map(x=>decodeData(x.notes.note,key,'aes-256-gcm',Buffer.from(x.notes.iv)))
    if(req.session.user){
      res.code(200)
      .headers('Content-Type/application/json','charset=utf-8')
      .send({notes:notesarr.length<1 ? undefined : notesarr})
    }

  } catch (err) {
    throw new Error(err);
  }
});



// functions

// check if user exists by id
async function checkExistingUsers(client, id) {
  // check for exisitng users
  let released = await client.query("select * from users where id=$1",[id])
  client.release()
  console.log(released.rows)
  return released.rows.length > 0
}
// add user to db
async function addUerToDb(client, id) {
  try {
    // add user
    await client.query("insert into users(id) values($1)", [id])
  } catch (err) {
    throw new Error(err);
  }
}
// remove user from db
async function RemoveFromDb(client,id){
  // destroy session
  await client.query('delete from users where id = $1',[id])
}
// encrypt data
function encodeData(data,key,algorithm,iv){
  console.log('start key encode')
  console.log(key)
  console.log('end of transmission')
  console.log(iv)
  // encode data
  const cipher = createCipheriv(algorithm,key,iv)
  const encodeData = cipher.update(data,'utf-8','base64') + cipher.final('base64');
  console.log(encodeData)
  return encodeData
}
// decrypt data
function decodeData(data,key,algorithm,iv){
  // decode data
  console.log('start key decode')
  console.log(key)
  console.log('iv for decode')
  console.log(iv)
  console.log('end of transmission')
  const decipher = createDecipheriv(algorithm,key,iv)
  console.log('help with this:')
  console.log(decipher)
  let decodedData = decipher.update(Buffer.from(data, "base64"),"utf-8")
  console.log('decoded section: ')
  console.log(decodedData.toString())
  return decodedData.toString()
}

















// fastify.register(require('./lib/abort.js'))
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