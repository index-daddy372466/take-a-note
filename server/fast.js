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
var methodOverride = require('method-override')


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
fastify.register(()=>methodOverride('_method'))
fastify.addHook("preHandler", async (req, res) => {
  const client = await fastify.pg.connect();

    const dateid = (Date.now().toString());
  // check for exisitng users
   if(!req.session.user && !(await checkExistingUsers(client,dateid))){
    req.session.user = {id:dateid,active:true,expired:false}
    addUerToDb(client,dateid)
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
  const statement = "insert into notepad(notes,user_id,unix) values($1,$2,$3)"
  await client.query(
    statement,
    [note, req.session.user.id,dateinfo.unix]);
    console.log(note)
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
    const notes = await client.query(
      "select notes,timestamp from notepad where user_id=$1",
      [req.session.user.id])
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
    // let relnotes = await client.query('select * from notepad where user_id = $1 and notes ~~* $2',[id,`%${spxnote}%`])
    // let relnotes = await client.query('select * from notepad where user_id = $1 and notes = $2;',[id,spxnote])
    let relnotes = await client.query('select * from notepad where notes=$1',[spxnote])
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
// filter users by creation date (id)
fastify.get('/api/admin/filter/:table/:column', async(req,res)=>{
  const client = await fastify.pg.connect()
  const {table,column} = req.params
  console.log(req.params)
  let {from,to,limit} = req.query, query
  // let column = /users/.test(table) ? 'id' : /notepad/.test(table) ? 'timestamp' : undefined;
  
  try{
      if(from && !to){
        // from = new Date(`${from}`).getTime()
        query = await client.query(`select * from ${table} where ${column} >= $1`,[from])
      }
      if(!from && to){
        // to = new Date(`${to}`).getTime()
        query = await client.query(`select * from ${table} where ${column} <= $1`,[+to])
        console.log('WTF!!!')
        console.log(to)
      }
      if(from && to){
        // from = new Date(`${from}`).getTime()
        // to = new Date(`${to}`).getTime()
        query = await client.query(`select * from ${table} where ${column} >= $1 and ${column} <= $2`,[from,to])
      }
      // if(/^(Invalid Date|NaN)$/.test(from)||/^(Invalid Date|NaN)$/.test(to)){
      //   res.code(403)
      //   .send('Unauthorized')
      // }
      console.log(from,to,limit)
      console.log(query.rows)
      res.code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({rows:query.rows});
  }
  catch(err){
    console.log(err)
    throw new Error(err)
  }
})


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