import { Writer, WriterStore } from '../models/writer'
import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const { TOKEN_SECRET } = process.env
const secretToken = TOKEN_SECRET;

export const verifyAuthToken = (req: Request, res: Response, next: Function) => {
    try{
        const authorizationHeader = req.headers.authorization
        const token = authorizationHeader?.split(' ')[1]

        jwt.verify(token as string, secretToken as string)
    }catch(err){
        res.status(401).json(err)
        return
    }

    next();
}

const store = new WriterStore()

const index = async (_req: Request, res: Response) => {
    try{
        const writers = await store.index()
        res.json(writers)
    }catch(err){
        res.status(400).json(err);
    }
}

const show = async (req: Request, res: Response) => {
    try{
        const writer = await store.show(+req.params.wid);
        res.json(writer);
    }catch(err){
        console.log(err)
        res.status(400).json(err);
    }
}

const create = async (req: Request, res: Response) => {
    try{
        const writer = {
            username: req.body.username,
            password: req.body.password
        };

        const result = await store.create(writer as Writer)
        const token_auth = await store.authenticate(req.body.username, req.body.password)

        res.status(201).json({token_auth: token_auth})
    }catch(err){
        res.status(400).json(err);
        console.log(err);
    }
}

const destroy = async (req: Request, res: Response) => {
    try{
        await store.delete(+(req.query.wid!))
        res.status(200).json()
    }catch(err){
        console.log(err);
        res.status(400).json(err)
    }
}

const update = async (req: Request, res: Response) => {
    try{
        const writer = {
            wid: +req.params.wid,
            username: req.body.username,
            password: req.body.password
        }
        await store.update(writer as Writer)
        res.status(200).json()
    }catch(err){
        res.status(400).json(err)
    }
}

const authenticate = async (req: Request, res: Response) => {
    try{
        const result = await store.authenticate(req.query.username as string, req.query.password as string)
        res.status(200).json(result)
    }catch(err){
        res.status(400).json(err)
    }
}

const deliverPoint = async (req: Request, res: Response) => {
    try{
        console.log(req.query)
        await store.deliverPoint(+req.query.srcWid!, +req.query.dstWid!, +req.query.point!)
        res.status(200).json()
    }catch(err){
        console.log(err);
        res.status(400).json(err)
    }
}

const writers_routes = (app: express.Application) => {
	app.get('/writers', verifyAuthToken, index)
    app.get('/writers/:wid', verifyAuthToken, show)
    app.post('/writers', create)
    app.delete('/writers', verifyAuthToken, destroy)
    app.patch('/writers/:wid', verifyAuthToken, update)
    app.get('/authenticate', authenticate)
    app.get('/deliverPoint', verifyAuthToken, deliverPoint)
}

export default writers_routes