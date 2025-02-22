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
const adminconn = require("../db.js").adminconnection;
const methodOverride = require('method-override');


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
// fastify.register(require('./lib/abort.js'))
fastify.register(require("@fastify/postgres"), fastconn.fastPgConnection);
// fastify.register(require("@fastify/postgres"), adminconn.fastAdminConnection);
fastify.register(()=>methodOverride('_method'))
fastify.addHook("preHandler", async (req, res) => {
  const client = await fastify.pg.connect();

    const dateid = (Date.now().toString());
  // check for exisitng users
   if(!req.session.user && !(await checkExistingUsers(client,dateid))){
    req.session.user = {id:dateid,active:true,expired:false}
    addUserToDb(client,dateid)
   } else if(req.session && (await checkExistingUsers(client,req.session.user.id))){
    console.log('session is active and captured')
   } else {
    console.log('idk what to tell you')
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
  const dateinfo = {
    date: new Date(Date.now()).toLocaleDateString(),
    time: new Date(Date.now()).toLocaleTimeString(),
    unix: Date.now()
  }
  // convert object of date info into an array
  const date = Object.values(dateinfo).filter(x=>typeof(x)!=='number' && /\d*/.test(x))
  console.log(date)
  console.log(dateinfo)
  const client = await fastify.pg.connect()
  const { note } = req.body;
  console.log(note)
  const query = "insert into notepad(notes,user_id,unix) values('"+note+"','"+req.session.user.id+"','"+dateinfo.unix+"')"
  await client.query(query)
  if(req.session.user){
    res
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({ note: note, date});
  };
})
// notes get route
fastify.get("/note", async (req, res) => {
  try {
    const client = await fastify.pg.connect()
    const query = "select notes,timestamp from notepad where user_id='"+req.session.user.id+"';"
    const notes = await client.query(query)
    // decode the list of encoded notes with it's perspective iv
    const notesarr = [...notes.rows].map(x=>{
      const dateinfo = {
        date: new Date(x.timestamp).toLocaleDateString(),
        time: new Date((x.timestamp)).toLocaleTimeString()
      }
      return {note:x.notes,timestamp:Object.values(dateinfo)}
    })
    if(req.session.user){
      res.code(200)
      .headers('Content-Type/application/json','charset=utf-8')
      .send({data:notesarr.length<1 ? undefined : notesarr})
    }

  } catch (err) {
    throw new Error(err);
  }
});
// filter through notes
fastify.get("/filter", async (req, res) => {
  const {spxnote} = req.query
  try {
    const client = await fastify.pg.connect()
    console.log(spxnote)
    const id = req.session.user.id
    const query = "select notes,timestamp from notepad where user_id= '" + req.session.user.id + "' and notes ='" + spxnote + "';";
    const relnotes = await client.query(query)
    
    console.log('relnotes')
    console.log(relnotes.rows)
    let relnotesv2 = relnotes.rows.map(x=>{
      const dateinfo = {
        date: new Date(x.timestamp).toLocaleDateString(),
        time: new Date((x.timestamp)).toLocaleTimeString()
      }
      return{note:x.notes,timestamp:Object.values(dateinfo)}
    });
    
    console.log(relnotesv2)
    if(req.session.user){
      res.code(200)
      .headers('Content-Type/application/json','charset=utf-8')
      .send({data:relnotesv2})
    }

  } catch (err) {
    console.log(err)
    throw new Error(err);
  }
});
// delete a note
fastify.delete('/note', async (req,res)=> {
const {text} = req.body
const userid = req.session.user.id || undefined
const client = await fastify.pg.connect()
try{
  // check if text and time match a row in notes table
 let delnote = await client.query('delete from notepad where notes=$1 and user_id=$2',[text,userid])
  res.code(200)
  .header("Content-Type", "application/json; charset=utf-8")
  .send({message:'note deleted'});
}
catch(err){
  throw new Error(err)
}
})
// delete all notes by userid
fastify.delete('/notes', async (req,res)=> {
  console.log('hitting route to del all notes')
  const userid = req.session.user.id || undefined
  const client = await fastify.pg.connect()
  console.log(req.body)
  try{
    // check if text and time match a row in notes table
   let delnote = await client.query('delete from notepad where user_id=$1',[userid])
    res.code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({message:'all notes deleted'});
  }
  catch(err){
    throw new Error(err)
  }
})


// functions

// check if user exists by id
async function checkExistingUsers(client, id) {
  // check for exisitng users
  const query = "select * from users where id='" + id + "';"
  let released = await client.query(query)
  client.release()
  console.log(released.rows)
  return released.rows.length > 0
}
// add user to db
async function addUserToDb(client, id) {
  try {
    // add user
    const query = "insert into users(id) values('" + id + "');"
    await client.query(query)
  } catch (err) {
    throw new Error(err);
  }
}


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