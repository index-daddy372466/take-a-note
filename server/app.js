require('./lib/dot.js')
// vars
const cors = require('cors');
const express = require('express')
const app = express();
const PORT = process.env.PORT || 3004
const path = require('path')
const pool = require('../db.js').pool
// middleware
app.use(express.static(path.resolve(__dirname,'../public')))
app.set('view engine','ejs')
app.set('views',path.resolve(__dirname,'../public'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// routes
app.route('/').get(async(req,res)=>{
  res.render("index.ejs");
})

// post note
app.route('/note').post(async(req,res)=>{
  const {note} = req.body
  console.log(note)
  await pool.query('insert into notepad(notes,user_id,unix) values($1,$2,$3)',[note,'fakeid',Date.now()])
  res.json(note)
})

// filter test
app.route('/filter').get(async(req,res)=>{
  const {note} = req.query
  console.log(note)
  let getNote = await pool.query("select notes,timestamp from notepad where notes = $1",[note])
  console.log('notes rows')
  console.log(getNote.rows)
  res.json(getNote.rows)
})




// listen on server
app.listen(PORT,()=>console.log(`listening on port ${PORT}`))