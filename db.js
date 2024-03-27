require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.DBU,
    database: process.env.DB,
    password: process.env.PD,
    port: process.env.DBP,
    host:process.env.DBH 
})

// console.log(pool)

module.exports = { pool };