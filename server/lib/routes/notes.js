let notes = []
async function notesroute(fastify, options) {

    // home route
    fastify.post("/note", async (req, res) => {
        const {note} = req.body;
        notes.push({note:note,time:Date.now()})
          res.code(200)
            .header('Content-Type','application/json; charset=utf-8')
            .send({note:note})
    });
    
    fastify.get("/note", async(req,res)=>{
      try{
        res.code(200)
          .header('Content-Type','application/json; charset=utf-8')
          .send({notes:notes})
      }
      catch(err){
        throw new Error(err)
      }
    })
  }
  
  module.exports = notesroute;
  