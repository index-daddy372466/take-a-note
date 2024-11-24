
const {pool} = require('../../db.js')
// clear the database with git command: 'git [run|urn] cleardb'
// git command is supplied with fdev for fastify
const cleardb = async () => {
    try{
        await pool.query('truncate users,notepad cascade; alter sequence notepad_id_seq restart with 1')
    }
    catch(err){
        console.log(err)
        throw new Error(err)
    }
}   
cleardb()

