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
    
    app.route('/notes').get((req,res,next)=>{
        const notes = req.query.notes
        try{
            if(notes){
                console.log(notes)
                next();
            }
        }
        catch(err){
            console.log(err)
            res.redirect('/')
        }
        },(req,res)=>{
            const notes = req.query.notes;
            res.json({message:notes})
        })
    app.route('/').post((req,res)=>{
        // console.log(req.query)
        const { notes } = req.body
        console.log(notes)
    })
       






}