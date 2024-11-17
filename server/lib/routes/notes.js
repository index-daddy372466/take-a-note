async function notesroute(fastify, options) {

    // home route
    fastify.post("/note", async (req, res) => {
        console.log('notes home route')
        // fastify.pg.query('select * from notepad',(err,result)=>{
        //     return err ? console.log(err) : console.log(result.rows)
        // })
        const {note} = req.body;
        console.log(req.ip)
        console.log(note)
        res.code(200)
           .header('Content-Type','application/json; charset=utf-8')
           .send({note:note})
    });

  }
  
  module.exports = notesroute;
  