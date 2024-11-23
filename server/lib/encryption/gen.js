const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const modulusLength = 1024,
type = 'pkcs1', // public key cryptography
type2 = 'pkcs8', // private key cryptography
format = 'pem'
const pubname = "/id_rsa_pub.pem"
const privname = "/id_rsa_priv.pem"
const destFolder = '/rsa'
const publicKeyEncoding = {
    type,
    format
}
const privateKeyEncoding = {
    type:type2,
    format
}

// generate keys
const {publicKey,privateKey}= crypto.generateKeyPairSync('rsa', {
    modulusLength,
    publicKeyEncoding,
    privateKeyEncoding
})

// write the files to location (only public key) // temporary
if(!fs.existsSync(destFolder)){
    fs.mkdirSync(path.join(__dirname,destFolder))
    fs.writeFileSync(path.join(__dirname,`${destFolder}/${pubname}`),publicKey)
}