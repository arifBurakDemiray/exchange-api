import {getUserId} from './jwt.service.js'
import { orm } from '../db/db.js'
import {Response} from '../util/response.js'
import { HttpStatus } from '../enums/status.enum.js'


export const shareService = {

    async getAll(req){

        const page = parseInt(req.query.page)
        const size = parseInt(req.query.size)

        const transactions = await orm.share.findMany({
            orderBy: [
                {
                    created_at: 'desc'
                }
            ],
            skip: page*size,
            take: size,
            where:{
                closed: false
            },
            select: {
                rate: true,
                symbol: true,
                created_at: true,
                updated_at: true,
                id: true,
                price: true,
                user: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            }
        })
        
        return Response().data(transactions).build()

    },
    async postShare(req){
        const userId = getUserId(req)
        //add controls

        try{
            return Response().data(await orm.share.create({
                data: {
                    symbol: req.body.symbol.toUpperCase(),
                    price: parseFloat(req.body.price),
                    user_id: userId,
                    rate: parseInt(req.body.rate)
                }
        })).build()}
        catch(e){
            console.log(e)
            return Response().message(req.t(e.meta.target)).status(HttpStatus.BAD_REQUEST).build()
        }


    }
}

//TODO update shares price hourly