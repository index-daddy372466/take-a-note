const fastify = require("fastify");

const fastconn = require("../../../db.js").fastconnection;


async function homeroute(fastify, options) {
  fastify.addHook("preHandler", async (req, res) => {
    const client = await fastify.pg.connect();

      const bufferId = Buffer.from(Date.now().toString(), "utf-8");
      let base64 = bufferId.toString("base64");
    // check for exisitng users
    //  let decodeId = Buffer.from(base64,'base64').toString()
     if(!req.session.user && !(await checkExistingUsers(client,base64))){
      req.session.user = {id:base64,active:true,expired:false}
      addUerToDb(client,base64)
     } else {
      console.log('user exists bro')
     }
     
     // check expired user
      const id = (req.session.user.id);
      let decodeid = Buffer.from(id,'base64').toString()
      let time = new Date(+decodeid).getTime()
      let expires = Math.ceil((Date.now() - time) / 1000);
      let expTime = 1800
      if(expires >= expTime){
        // remove id from db
        await RemoveFromDb(client,req.session.user['id'])
        // destroy session
        req.session.destroy();
      }
  });


  // home route
  fastify.get("/", async (req, res) => {
    try{
      return res.viewAsync("index.ejs");
    }
    catch(err){
      console.log(err)
      throw new Error(err)
    }
  });
}

async function checkExistingUsers(client, id) {
  // check for exisitng users
  let released = await client.query("select * from users where id=$1",[id])
  client.release()
  console.log(released.rows)
}
async function addUerToDb(client, id) {
  try {
    // add user
    await client.query("insert into users(id) values($1)", [id])
  } catch (err) {
    throw new Error(err);
  }
}
async function RemoveFromDb(client,id){
  // destroy session
  await client.query('delete from users where id = $1',[id])
}
// function checkExpiredUser(fast,id){
//    // check if user is expired
//    fast.pg.query('select id from users where id = $1',[id],(err,result)=>{
//     if(err){
//       throw new Error(err)
//     } else {
//       const id = (result.rows[0].id);
//       console.log(id)
//       let decodeid = Buffer.from(id,'base64').toString()
//       console.log(decodeid)
//       let time = new Date(+decodeid).getTime()
//       let expires = Math.ceil((Date.now() - time) / 1000);
//       console.log('expires:')
//       console.log(expires)
//       if(expires >= 10){
//         console.log("EXPIRED SESSION. PLEASE DESTROY!");
//       }
//     }
//   })

// }
module.exports = homeroute;
