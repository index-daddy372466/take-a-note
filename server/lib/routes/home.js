const fastconn = require("../../../db.js").fastconnection;
async function homeroute(fastify, options) {
  fastify.addHook("preHandler", (req, res, next) => {
    console.log(Date.now())
      const bufferId = Buffer.from(Date.now().toString(), "utf-8");
      let base64 = bufferId.toString("base64");
      console.log(base64)
    // check for exisitng users
     let decodeId = Buffer.from(base64,'base64').toString()
     console.log(decodeId)
     if(!req.session.user && !checkExistingUsers(fastify,base64)){
      req.session.user = {id:base64,active:true}
      addUerToDb(fastify,base64)
     }
     next()
  });

  // home route
  fastify.get("/", async (req, res) => {
    console.log(req.session.user)
    const bufferId = Buffer.from(Date.now().toString(), "utf-8");
    let base64 = bufferId.toString("base64");
    console.log(base64);

    return res.viewAsync("index.ejs");
  });
}

function checkExistingUsers(fast, id) {
  // check for exisitng users
  fast.pg.query("select * from users where id=$1",[id], (err, result) => {
    if (err) {
      throw new Error(err);
    } else {
      if (!result) {
        console.log('user does not exist')
        return false;
      } else {
        console.log("user exists");
        return true;
      }
    }
  });
}
function addUerToDb(fast, id) {
  try {
    fast.pg.query("insert into users(id) values($1)", [id], (err, result) => {
      return err ? console.log(err) : console.log("user inserted!");
    });
  } catch (err) {
    throw new Error(err);
  }
}
module.exports = homeroute;
