require('dotenv').config()
const { Pool } = require('pg')
// pg string example
//postgres://user:password@host:port/db
const fastPgConnection = {connectionString:`postgres://${process.env.DBU}:${process.env.PD}@${process.env.DBH}:${process.env.DBP}/${process.env.DB}`}
const fastconnection = {fastPgConnection}

const pool = new Pool({
    user: process.env.DBU,
    database: process.env.DB,
    password: process.env.PD,
    port: process.env.DBP,
    host:process.env.DBH,
})


module.exports = { pool, fastconnection };


// connect multi clients
// import fastify from 'fastify';

// import { fastifyPostgres } from '../../../index';

// const app = fastify();

// app.register(fastifyPostgres, {
//   name: 'sum',
//   connectionString: 'postgres://user:password@host:port/sub-db',
// });

// app.register(fastifyPostgres, {
//   name: 'sub',
//   connectionString: 'postgres://user:password@host:port/sub-db',
// });

// app.get('/calc', async () => {
//   const sumClient = await app.pg.sum.connect();
//   const subClient = await app.pg.sub.connect();

//   const sumResult = await sumClient.query<{ sum: number }>(
//     'SELECT 2 + 2 as sum'
//   );
//   const subResult = await subClient.query<{ sub: number }>(
//     'SELECT 6 - 3 as sub'
//   );

//   sumClient.release();
//   subClient.release();

//   return {
//     sum: sumResult.rows,
//     sub: subResult.rows,
//   };
// });

// export { app };
