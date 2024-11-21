async function notesroute(fastify, options) {
  // notes route
  fastify.post("/note", async (req, res) => {
    const client = await fastify.pg.connect()
    const { note } = req.body;
    // notes.push({note:note,time:Date.now()})
    await client.query(
      "insert into notepad(notes,user_id) values($1,$2)",
      [{ note: note }, req.session.user.id]);
    res
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ note: note });
  });
  fastify.get("/note", async (req, res) => {
    try {
      const client = await fastify.pg.connect()
      const notes = await client.query(
        "select * from notepad where user_id=$1",
        [req.session.user.id])
      const notesarr = notes.rows;
      res.code(200)
      .send({notes:notesarr.length<1 ? undefined : notesarr})
      
    } catch (err) {
      throw new Error(err);
    }
  });
}

module.exports = notesroute;
