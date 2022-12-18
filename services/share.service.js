import {getUserId} from './jwt.service.js'
import { orm } from '../db/db.js'
import {Response} from '../util/response.js'
import { HttpStatus } from '../enums/status.enum.js'
import { minuteBetween } from '../util/date.util.js'

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
            return Response().message(req.t(e.meta.target)).status(HttpStatus.BAD_REQUEST).build()
        }


    },
    async updateShare(req){
        const userId = getUserId(req)
        const shareId = req.body.share_id

        const share = await orm.share.findFirst({
            where:{
                id: shareId
            }
        })

        if(!share){
            return Response().message(req.t("share.not_found")).status(HttpStatus.BAD_REQUEST).build()
        }

        if(share.user_id !== userId){
            return Response().message(req.t("share.not_authorized")).status(HttpStatus.BAD_REQUEST).build()
        }

        if(minuteBetween(Date.now(),share.updated_at)<60){
            return Response().message(req.t("share.update_price_time")).status(HttpStatus.BAD_REQUEST).build()
        }

        const updated = await orm.share.update({
            where:{id:shareId},
            data:{
                price: req.body.price,
                closed: req.body.closed
            }
        })

        return Response().data(updated).build()
    }
}

