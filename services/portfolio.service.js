import {getUserId} from './jwt.service.js'
import { orm } from '../db/db.js'
import {Response} from '../util/response.js'
import { HttpStatus } from '../enums/status.enum.js'


export const portfolioService = {

    async createPortfolio(req){
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

        if(share.user_id === userId){
            return Response().message(req.t("share.self_buy")).status(HttpStatus.BAD_REQUEST).build()
        }

        const existing = await orm.portfolio.findFirst({
            where: {
                user_id: userId,
                share_id: shareId
            },
            select:{
                id: true
            }
        })

        if(existing){
            return Response().message(req.t("portfolio.exists")).status(HttpStatus.BAD_REQUEST).build()
        }

        const created = await orm.portfolio.create({
            data: {
                share_id: shareId,
                user_id: userId,
                rate: parseInt(req.body.rate)
            }
        })

        return Response().data(created).build()

    },
    async deletePortfolio(req){
        const userId = getUserId(req)
        const portfolioId = req.params.id

        const portfolio = await orm.portfolio.findFirst({
            where:{
                user_id: userId,
                id: portfolioId
            }
        })

        if(!portfolio){
            return Response().message(req.t("portfolio.not_found")).status(HttpStatus.BAD_REQUEST).build()
        }

        const asset = await orm.asset.findFirst({
            where: {
                user_id: userId,
                share_id: portfolio.share_id,
                rate: {
                    gt: 0
                }
            }
        })

        if(asset){
            return Response().message(req.t("portfolio.sell_asset")).status(HttpStatus.BAD_REQUEST).build()
        }

        await orm.portfolio.delete({
            where: {
                id: portfolioId
            }
        })

        return Response().message(req.t("success")).build()
    },
    async getPortfolios(req){
        const userId = getUserId(req)

        const portfolios = await orm.portfolio.findMany({
            where: {
                user_id: userId
            },
            select:{
                id: true,
                rate: true,
                created_at: true,
                share: {
                    select: {
                        id: true,
                        symbol: true
                    }
                }
            }
        })

        return Response().data(portfolios).build()
    }
}
