require('./lib/dot.js')
// vars
const cors = require('cors');
const express = require('express')
const app = express();
const PORT = process.env.PORT || 3004
const path = require('path')
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
app.route('/note').post((req,res)=>{
  const {note} = req.body
  console.log(note)
  res.json(note)
})


// listen on server
app.listen(PORT,()=>console.log(`listening on port ${PORT}`))