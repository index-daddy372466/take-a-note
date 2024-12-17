require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.DBU,
    database: process.env.DB,
    password: process.env.PD,
    port: process.env.DBP,
    host:process.env.DBH,
})
const adminpool = new Pool({
    user: process.env.DBUA,
    database: process.env.DB,
    password: process.env.PDA,
    port: process.env.DBP,
    host:process.env.DBH,
})

module.exports = { pool,adminpool };