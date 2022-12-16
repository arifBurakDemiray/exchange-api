import {getUserId} from './jwt.service.js'
import { orm } from '../db/db.js'
import {Response} from '../util/response.js'
import {ValidResponse} from '../util/validation.response.js'
import { HttpStatus } from '../enums/status.enum.js'
import {ETransaction } from "@prisma/client";


async function getPortfolio(userId,shareId){
    return await orm.portfolio.findFirst({
        where: {
            user_id: userId,
            share_id: shareId
        },
        include:{
            share: true,
            user: true
        }
    })
}

async function buy(req){
    const userId = getUserId(req)
    const rate = parseInt(req.body.rate)

    const portfolio = await getPortfolio(userId,req.body.share_id)

    if(!portfolio){
        return Response().message(req.t('transaction.portfolio_not')).status(HttpStatus.BAD_REQUEST).build()
    }

    const asset = await orm.asset.findFirst({
        where:{
            user_id: userId,
            share_id: req.body.share_id
        }
    })

    if(portfolio.share.price * rate > portfolio.user.money){
        return Response().message(req.t('transaction.create.not_enough_money')).status(HttpStatus.BAD_REQUEST).build()
    }

    if(portfolio.share.rate < rate || (asset && (asset.rate > portfolio.rate + rate)) ){
        return Response().message(req.t('transaction.create.portfolio_denied')).status(HttpStatus.BAD_REQUEST).build()
    }

    const [_0,_1,_2,transaction] = await orm.$transaction([
        orm.share.update({where: {id: req.body.share_id},data: {rate: portfolio.share.rate - rate}}),
        orm.user.update({where: {id: userId},data: {money: portfolio.user.money - (rate * portfolio.share.price)}}),
        asset ? orm.asset.update({where: {id: asset.id},data: {rate: rate + asset.rate}}) :
        orm.asset.create({data: {user_id: userId,share_id: portfolio.share_id,rate: rate}}),
        orm.transaction.create({data: {user_id: userId, share_id: req.body.share_id,rate: rate, cost: rate * portfolio.share.price,type: ETransaction.BUY}})
    ])

    return Response().data(transaction).build()
}

async function sell(req){
    const userId = getUserId(req)
    const rate = parseInt(req.body.rate)

    const portfolio = await getPortfolio(userId,req.body.share_id)

    if(!portfolio){
        return Response().message(req.t('transaction.portfolio_not')).status(HttpStatus.BAD_REQUEST).build()
    }

    const asset = await orm.asset.findFirst({
        where:{
            user_id: userId,
            share_id: req.body.share_id
        }
    })

    if(asset.rate < rate){
        return Response().message(req.t('transaction.create.not_enough_rate')).status(HttpStatus.BAD_REQUEST).build()
    }

    const [_0,_1,_2,transaction] = await orm.$transaction([
        orm.share.update({where: {id: req.body.share_id},data: {rate: portfolio.share.rate + rate}}),
        orm.user.update({where: {id: userId},data: {money: portfolio.user.money + (rate * portfolio.share.price)}}),
        orm.asset.update({where: {id: asset.id},data: {rate: asset.rate - rate}}),
        orm.transaction.create({data: {user_id: userId, share_id: req.body.share_id,rate: rate, cost: rate * portfolio.share.price,type: ETransaction.SELL}})
    ])

    return Response().data(transaction).build()
}

export const transactionService = {

    async getAll(req){
        
        const userId = getUserId(req)
        const page = parseInt(req.query.page)
        const size = parseInt(req.query.size)

        const transactions = await orm.transaction.findMany({
            orderBy: [
                {
                    created_at: 'desc'
                }
            ],
            skip: page*size,
            take: size,
            where : {
                user_id: userId
            },
            select: {
                rate: true,
                cost: true,
                created_at: true,
                id: true,
                type: true,
                share: {
                    select: {
                        symbol: true,
                        id: true
                    }
                }
            }
        })
        
        return Response().data(transactions).build()
    },

    async postTransaction(req){

        let response;

        switch(req.body.type) {
            case ETransaction.BUY:
                response = await buy(req)
                break;
            case ETransaction.SELL:
                response = await sell(req)
                break;
            default:
                response = Response().message(req.t('transaction.create.invalid_type')).status(HttpStatus.BAD_REQUEST).build()
            } 

        return response
    },
}
