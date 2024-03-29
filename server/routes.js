module.exports = function(app,pool){
    var path = require('path');
    // res.sendFile(path.resolve('temp/index.html'));

    // get homepage
    app.route('/').get((req,res)=>{
        
        try{
            console.log('request succeeded')
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
        try{
            if(notes){
                const insertNote = await pool.query("insert into notepad(notes) values($1)",
                [notes])
            }
            else{
                console.log('you entered nothing')
            }
            res.redirect('/')
            
        }
        catch(err){
            console.log(err)
            res.redirect('/')
        }
        
    })

    app.get('/notes',async(req,res)=>{
        // alternate ending
        // get all fields
        const getFields = await pool.query('select * from notepad')
        const rows = getFields.rows;
        // send notes via json
        res.json(rows.map(row =>{
            return {notes:row.notes,timestamp:row.timestamp}
        }))
    })

    app.route('/delete').post(async(req,res)=>{
        const notes = req.body.notes;   
        
        try{
            await pool.query("truncate notepad;alter sequence notepad_id_seq restart with 1")
            res.redirect('/')
        }
        catch(err){
            console.log(err)
            res.redirect('/')
        }
    })
   
       
}