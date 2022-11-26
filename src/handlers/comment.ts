import { Comment, CommentStore } from '../models/comment'
import express, { Request, Response } from 'express'
import { verifyAuthToken } from './writer'

const store = new CommentStore()

const show = async (req: Request, res: Response) => {
    try{
        const boards = await store.show(+req.params.did!)
        res.json(boards)
    }catch(err){
        res.status(400).json(err);
    }
}

const create = async (req: Request, res: Response) => {
    try{
        console.log(req.body);

        const comment = {
            content: req.body.content
        }

        const result = await store.create(+req.body.wid!, +req.body.did!, comment as Comment)

        res.status(201).json(result)
    }catch(err){
        res.status(400).json(err);
    }
}

const destroy = async (req: Request, res: Response) => {
    try{
        await store.delete(+(req.query.cid!))
        res.status(200).json()
    }catch(err){
        res.status(400).json(err)
    }
}

const update = async (req: Request, res: Response) => {
    try{
        const comment = {
            cid: +req.params.cid,
            content: req.body.content
        }
        await store.update(comment as Comment)
        res.status(200).json()
    }catch(err){
        res.status(400).json(err)
    }
}

const comments_routes = (app: express.Application) => {
	app.get('/comments/:did', verifyAuthToken, show)
    app.post('/comments', verifyAuthToken, create)
    app.delete('/comments', verifyAuthToken, destroy)
    app.patch('/comments/:cid', verifyAuthToken, update)
}

export default comments_routes