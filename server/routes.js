module.exports = function(app){
    var path = require('path');
    // res.sendFile(path.resolve('temp/index.html'));

    // get homepage
    app.route('/')
       .get((req,res)=>{
        console.log('request succeeded')
        try{
            res.sendFile(path.resolve('views/index.html'))
        }
        catch(err){
            console.log(err)
            res.json({message:'you are not the trusted user'})
        }
       })






}