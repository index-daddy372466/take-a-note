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
        const id = req.body.id
        const notes = req.body.notes;
        // insert new note into db
        try{
            if(notes){
                const insertNote = await pool.query("insert into notepad(notes) values($1)",
                [notes])
                const getID = await pool.query("select id from notepad where notes=$1",[notes])
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
            return {id:row.id,notes:row.notes,timestamp:row.timestamp}
        }))
    })

    app.route('/delete').post(async(req,res)=>{
        
        const notes = req.body.notes;   
        
        try{
            await pool.query("truncate notepad;alter sequence notepad_id_seq restart with 1")
            res.redirect('/');
        }
        catch(err){
            console.log(err)
            res.redirect('/')
        }
    })
    app.get('/delete/:id',async(req,res)=>{
        const id = req.params.id;
        try{
        if(!id){
            alert('database is empty')
            red.redirect('/')
        }
        else{
        console.log(id)
        await pool.query("delete from notepad where id=$1",[id])
        console.log('you deleted an item')
        res.redirect('/')
        }
        }
        catch(err){
            console.log(err)
        }
    })
   
       
}