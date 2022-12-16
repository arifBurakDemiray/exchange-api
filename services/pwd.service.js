
import bcrypt from 'bcrypt'

export async function encryptPassword(password) {

    return bcrypt
        .hash(password, parseInt(process.env.BCRYPT_ROUND))
        .then(hashedPassword => {
            return hashedPassword
        })
        .catch((e) => {console.log(e)})
 };
 

 export async function comparePassword(plainPass, hashword) {

    return bcrypt
        .compare(plainPass,hashword)
        .then(matched =>{
            return matched
        })
 };