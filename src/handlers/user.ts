import { User, UserStore } from '../models/user'
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

const store = new UserStore()

const index = async (_req: Request, res: Response) => {
    try{
        const users = await store.index()
        res.json(users)
    }catch(err){
        res.status(400).json(err);
    }
}

const show = async (req: Request, res: Response) => {
    try{
        const users = await store.show(req.params.id);
        res.json(users);
    }catch(err){
        console.log(err)
        res.status(400).json(err);
    }
}

const create = async (req: Request, res: Response) => {
    try{
        const user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: req.body.password
        };

        const result = await store.create(user as User)
        const token_auth = await store.authenticate(req.body.username, req.body.password)

        res.status(201).json({token_auth: token_auth})
    }catch(err){
        res.status(400).json(err);
    }
}

const destroy = async (req: Request, res: Response) => {
    try{
        const deleted = await store.delete(req.query.id as string)
        res.json(deleted)
    }catch(err){
        res.status(400).json(err);
    }
}

const users_routes = (app: express.Application) => {
	app.get('/users', verifyAuthToken, index)
    app.get('/users/:id', verifyAuthToken, show)
    app.post('/users', verifyAuthToken, create)
    app.delete('/users', verifyAuthToken, destroy)
}

export default users_routes