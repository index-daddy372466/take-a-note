let notes = [];
async function notesroute(fastify, options) {
  // home route
  fastify.post("/note", async (req, res) => {
    const { note } = req.body;
    // notes.push({note:note,time:Date.now()})
    fastify.pg.query(
      "insert into notepad(notes,user_id) values($1,$2)",
      [{ note: note }, req.session.user.id],
      (err, result) => {
        return err ? console.log(err) : console.log("positive note insert");
      }
    );
    res
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ note: note });
  });


  let notes

  fastify.get("/note", async (req, res) => {
    try {
      fastify.pg.query(
        "select * from notepad where user_id=$1",
        [req.session.user.id],
        (err, result) => {
          if (err) {
            throw new Error(err);
          } else {
            let notes = [...result.rows]
            console.log(notes)
          }
        }
      );
      res.code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({notes:['test',1,false].map(x=>{
        return {note:x}
      })})
      
    } catch (err) {
      throw new Error(err);
    }
  });
}

module.exports = notesroute;
