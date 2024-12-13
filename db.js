require('dotenv').config()
const { Pool } = require('pg')
// pg string example
//postgres://user:password@host:port/db
const fastPgConnection = {connectionString:`postgres://${process.env.DBU}:${process.env.PD}@${process.env.DBH}:${process.env.DBP}/${process.env.DB}`}
const fastconnection = {fastPgConnection}

const fastAdminConnection = {connectionString: `postgres://${process.env.DBUA}:${process.env.PDA}@${process.env.DBH}:${process.env.DBP}/${process.env.DB}`}
const adminconnection = {fastAdminConnection}
const pool = new Pool({
    user: process.env.DBU,
    database: process.env.DB,
    password: process.env.PD,
    port: process.env.DBP,
    host:process.env.DBH,
})


module.exports = { pool, fastconnection, adminconnection };