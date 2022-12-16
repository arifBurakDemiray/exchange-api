import authRouter from './auth.controller.js'
import todoRouter from './todo.controller.js'
import transactionController from './transaction.controller.js'
import cookieParser from 'cookie-parser';
import express from 'express';

export function subscribeEnpoints(app){
    app.use('/',authRouter)
    app.use('/',todoRouter)
    app.use('/',transactionController)
}

export function configRequestTypes(app){
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
}
