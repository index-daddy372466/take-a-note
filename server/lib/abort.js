
const {pool, adminpool} = require('../../db.js')
const arg = process.argv
console.log(arg)
// clear the database with git command: 'git [run|urn] cleardb'
// git command is supplied with fdev for fastify
const cleardb = async () => {
    try{
        const reg = new RegExp('^'+(process.env.BPCLR).replace(/ /g,'')+'$')
        if(reg.test(arg[arg.length-1])){
            await adminpool.query('truncate users,notepad cascade; alter sequence notepad_id_seq restart with 1')
        } else {
            console.log('you are not admin. unauthorized')
        }
        process.nextTick(()=>{
            console.log('db cleared successfully')
            process.exit(0)
        })
    }
    catch(err){
        console.log(err)
        throw new Error(err)
    }
}   
cleardb()

