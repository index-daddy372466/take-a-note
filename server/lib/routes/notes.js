async function notesroute(fastify, options) {

    // home route
    fastify.get("/notes", async (req, res) => {
        res.send('notes home route')
        fastify.pg.query('select * from notepad',(err,result)=>{
            return err ? console.log(err) : console.log(result)
        })
    });

  }
  
  module.exports = notesroute;
  