module.exports = function(app,pool){
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
    
    app.route('/notes').post(async(req,res)=>{
        // identify notes 
        const notes = req.body.notes;
        // insert new note into db
        const insertNote = await pool.query("insert into notepad(notes) values($1)",
        [notes])

        // get all fields
        const getFields = await pool.query('select * from notepad')
        const rows = getFields.rows;
        // send notes via json
        res.json(rows.map(row =>{
            return {notes:row.notes,timestamp:row.timestamp}
        }))
        })
    app.get('/notes',(req,res)=>{
        res.redirect('/')
    })
   
       
}