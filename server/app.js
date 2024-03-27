require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express();
const routes = require('./routes')
const { pool } = require('../db')
const PORT = !process.env.PORT ? 3023 : process.env.PORT

// middleware
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/public', express.static(`${process.cwd()}/public`));




// connect routes.js
routes(app,pool)

app.listen(PORT,()=>{
    console.log('You are listening on port: '+ PORT)
})