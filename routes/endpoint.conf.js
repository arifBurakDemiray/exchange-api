import authRouter from './auth.controller.js'
import assetRouter from './asset.controller.js'
import userRouter from './user.controller.js'
import shareRouter from './share.controller.js'
import portfolioRouter from './portfolio.controller.js'
import transactionRouter from './transaction.controller.js'
import cookieParser from 'cookie-parser';
import express from 'express';

export function subscribeEnpoints(app){
    app.use('/',authRouter)
    app.use('/',userRouter)
    app.use('/',transactionRouter)
    app.use('/',shareRouter)
    app.use('/',portfolioRouter)
    app.use('/',assetRouter)
}

export function configRequestTypes(app){
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
}
