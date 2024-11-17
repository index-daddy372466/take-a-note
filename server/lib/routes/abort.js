

async function abortroute(fastify, options) {

    // home route
    fastify.get("/api/abort", async (req, res) => {
        res.send('notes home route')
        fastify.pg.query('truncate users,notepad cascade; alter sequence notepad_id_seq restart with 1',(err,result)=>{
            return err ? console.log(err) : result
        })
    });

  }
  
  module.exports = abortroute;