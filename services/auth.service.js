import {generateAccessToken} from './jwt.service.js'
import {comparePassword,encryptPassword} from './pwd.service.js'
import { orm } from '../db/db.js'
import {minuteBetween} from '../util/date.util.js'
import {sendMail} from '../services/email.service.js'
import { v4 as uuidv4 } from 'uuid';
import {Response} from '../util/response.js'
import {HttpStatus} from '../enums/status.enum.js'


async function createUserCode(user){

    await orm.userCode.deleteMany({
        where: {
            user_id: user.id
        }
    })

    try {
        return await orm.userCode.create({
            data: {
                code: uuidv4(),
                user_id: user.id
            }
        })}
        catch(e) {
            return {message: req.t(e.meta.target), status: 400}
        }
}

export const authService = {
    async authenticate(req) {

        const username = req.body.username
        const password = req.body.password
        const granty_type = req.body.grant_type
        const failResponse = Response().message(req.t('login_failed')).status(HttpStatus.BAD_REQUEST).build()
        if(!granty_type || granty_type !== 'password' ){
            return failResponse
        }
    
        const maybeUser = await orm.user.findFirst({
            where: {
                email: username,
                active: true
            },
            select: {
                password: true,
                id: true,
                last_logged_in: true,
            },
        })
    
        if(!maybeUser){ return failResponse}
        if(minuteBetween(Date.now(),maybeUser.last_logged_in)<=5)  {return {message:req.t('login_recently'),status: HttpStatus.TOO_MANY_REQUEST}}
    
        if(await comparePassword(password,maybeUser.password)){
            await orm.user.update({
                where: {
                    id: maybeUser.id
                },
                data:{
                    last_logged_in: new Date(Date.now())
                }
            })
    
            return {access_token: generateAccessToken(username,maybeUser.id),status: HttpStatus.OK}
        }
    
        return failResponse
    },

    async sendAgain(req){
        const username = req.body.email
        const response = Response().message(req.t('email_sent_resp')).build()

        const maybeUser = await orm.user.findFirst({
            where: {
                email: username,
                active: false
            }
        })
    
        if(!maybeUser){ return response}

        const code = await createUserCode(maybeUser)

        const subject = req.t('email.confirmation.subject')

        sendMail({
            template: './views/confirm.pug',
            subject: subject,
            username: username,
            objects : {
                title: req.t('email.confirmation.title'),
                subject: subject,
                body: req.t('email.confirmation.body'),
                link: ''.concat(process.env.BASE_URL,'confirm?code=',code.code),
                button_name : req.t('email.confirmation.button_name'),
                warning: req.t('email.confirmation.warning')
            }
        })
        return response
    },

    async register(req){
        const response = Response().message(req.t('email_sent_resp')).build()
        const username = req.body.email
        const password = await encryptPassword(req.body.password)
        let user;
        try {
        user = await orm.user.create({
            data: {
                email: username,
                password: password
            }
        })}
        catch(e) {
            return response
        }
        
        const code = await createUserCode(user)

        const subject = req.t('email.confirmation.subject')

        sendMail({
            template: './views/template.pug',
            subject: subject,
            username: username,
            objects : {
                title: req.t('email.confirmation.title'),
                subject: subject,
                body: req.t('email.confirmation.body'),
                link: ''.concat(process.env.BASE_URL,'confirm?code=',code.code),
                button_name : req.t('email.confirmation.button_name'),
                warning: req.t('email.confirmation.warning')
            }
        })
        return response
    },

    async resetPassword(req){
        const response = Response().message(req.t('email_sent_resp')).build()
        const username = req.query.email
        let user;
        try {
            user = await orm.user.findFirst({
                where: {
                    email: username,
                    active: true
                },
            })
        }
        catch(e) {
            return response
        }
        
        const code = await createUserCode(user)

        const subject = req.t("email.reset_pwd.subject")

        sendMail({
            template: './views/template.pug',
            subject: subject,
            username: username,
            objects : {
                title: req.t('email.reset_pwd.title'),
                subject: subject,
                body: req.t('email.reset_pwd.body'),
                link: ''.concat(process.env.BASE_URL,'reset?code=',code.code),
                button_name : req.t('email.reset_pwd.button_name'),
                warning: req.t('email.reset_pwd.warning')
            }
        })
        return response
    },

    async confirm(req){
        const code = req.query.code

        const maybeCode = await orm.userCode.findFirst({
            where: {
                code: code
            },
            select: {
                user_id: true,
                created_at: true
            }
        })
    
        if(!maybeCode){ return {message:req.t('fail'),status: 400}}
        if(minuteBetween(Date.now(),maybeCode.created_at)>=60){ return {message:req.t('fail'),status: 400}}

        await orm.userCode.deleteMany({
            where: {
                user_id: maybeCode.user_id
            }
        })
    

        await orm.user.update({
            where: {
                id: maybeCode.user_id
            },
            data: {
                active: true
            }
        })

        return {message: req.t('success'),status: 200}
    }
}
