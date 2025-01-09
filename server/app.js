require("dotenv").config();
// vars
const cors = require('cors');
const express = require('express')
const app = express();
const PORT = process.env.PORT || 3004
const path = require('path')
const pool = require('../db.js').pool
const session = require('express-session')
const cookie = { maxAge: 1800000, secure: false }
// middleware
app.use(express.static(path.resolve(__dirname,'../public')))
app.set('view engine','ejs')
app.set('views',path.resolve(__dirname,'../public'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
  secret: process.env.SECRET1,
  cookieName: "sessionId",
  cookie: { maxAge: 1800000, secure: false, httpOnly:true },
  resave:false,
  saveUninitialized:false
}))
// routes
app.route('/').get(async(req,res)=>{
  res.render("index.ejs");
})
app.use(userManager)


// post note
app.route('/note').post(async(req,res)=>{
  const dateinfo = {
    date: new Date(Date.now()).toLocaleDateString(),
    time: new Date(Date.now()).toLocaleTimeString(),
    unix: Date.now()
  }
  // convert object of date info into an array
  const date = Object.values(dateinfo).filter(x=>typeof(x)!=='number' && /\d*/.test(x))
  const { note } = req.body;
  console.log(note)
  const query = "insert into notepad(notes,user_id,unix) values('"+note+"','"+req.session.user.id+"','"+dateinfo.unix+"')"
  await pool.query(query)
  if(req.session.user){
    res.json({ note: note, date});
  }
})

// filter test
app.route('/filter').post(async(req,res)=>{
  const {note} = req.body
  console.log(note)
  // let getNote = await pool.query("select notes,timestamp from notepad where notes = $1",[note])
  const query = "select notes,timestamp from notepad where notes ='" + note + "';";
  let getNote = await pool.query(query)
  console.log('notes rows')
  console.log(getNote.rows)
  res.json(getNote.rows)
})

app.route('/note').get(async(req,res)=>{
  const note = req.query.note
  try {
    const query = "select notes,timestamp from notepad where user_id='"+req.session.user.id+"';"
    const notes = await pool.query(query)
    // decode the list of encoded notes with it's perspective iv
    const notesarr = [...notes.rows].map(x=>{
      const dateinfo = {
        date: new Date(x.timestamp).toLocaleDateString(),
        time: new Date((x.timestamp)).toLocaleTimeString()
      }
      return {note:x.notes,timestamp:Object.values(dateinfo)}
    })
    if(req.session.user){
      res.json({data:notesarr.length<1 ? undefined : notesarr})
    }

  } catch (err) {
    throw new Error(err);
  }
})

app.route('/note').delete(async(req,res)=>{
  const {text} = req.body
  const userid = req.session.user.id || undefined
  try{
    // check if text and time match a row in notes table
  let delnote = await pool.query('delete from notepad where notes=$1 and user_id=$2',[text,userid])
    res.json({message:'note deleted'});
  }
  catch(err){
    throw new Error(err)
  }
})

app.route('/notes').delete(async(req,res)=>{
  const userid = req.session.user.id || undefined
  try{
    // check if text and time match a row in notes table
   let delnote = await pool.query('delete from notepad where user_id=$1',[userid])
    res.json({message:'all notes deleted'});
  }
  catch(err){
    throw new Error(err)
  }
})



// functions
async function userManager(req,res,next){
  const dateid = (Date.now().toString());
  console.log(req.session)
  // check for exisitng users
   if(!req.session.user && !(await checkExistingUsers(pool,dateid))){
    req.session.user = {id:dateid,active:true,expired:false}
    addUserToDb(pool,dateid)
   } else if(req.session && (await checkExistingUsers(pool,req.session.user.id))){
    console.log('session is active and captured')
   } else {
    console.log('idk what to tell you')
   }
   next();
}

// check if user exists by id
async function checkExistingUsers(client, id) {
  // check for exisitng users
  const query = "select * from users where id='" + id + "';"
  let released = await client.query(query)
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
// listen on server
app.listen(PORT,()=>console.log(`listening on port ${PORT}`))