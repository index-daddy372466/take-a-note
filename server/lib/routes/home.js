async function homeroute(fastify, options) {

  // home route
  fastify.get("/", async (req, res) => {
    return res.viewAsync("index.ejs");
  });



}

module.exports = homeroute;
