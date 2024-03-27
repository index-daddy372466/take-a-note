require('dotenv').config()
const session = require("express-session")

module.exports = function(app,sesh){ // app & session argument

    app.use(session({
        secret:process.env
    }))
}