const { pool } = require('./db')

async function insertData(){
    const [notes]= process.argv.slice(2);

    try{
        const res = await pool.query(
            "insert into notepad(notes) values($1)",
            [notes]
        );
        console.log(res.command)
        console.log(notes)
        // console.log(`notes added: ${notes}`)
    }
    catch(err){
        console.log(err);
    }
    
}
insertData();