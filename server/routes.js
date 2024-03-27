module.exports = function(app){
    var path = require('path');
    // res.sendFile(path.resolve('temp/index.html'));

    // get homepage
    app.route('/')
       .get((req,res)=>{
        
        try{
            console.log('request succeeded')
            res.sendFile(path.resolve('views/index.html'))
        }
        catch(err){
            console.log(err)
            res.json({message:'you are not the trusted user'})
        }
       })
    
    // app.route('/test').get((req,res)=>{
    //     console.log(req.query)
    //     console.log(req.body)
    // })
    // app.route('/test').post((req,res)=>{
    //     // console.log(req.query)
    //     const { textarea, name } = req.body
    //     console.log(req.body)
    //     res.json({name,textarea})
    // })
       






}