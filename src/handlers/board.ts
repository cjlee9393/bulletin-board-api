import { Board, BoardStore } from '../models/board'
import express, { Request, Response } from 'express'
import { verifyAuthToken } from './writer'

const store = new BoardStore()

const index = async (_req: Request, res: Response) => {
    try{
        const boards = await store.index()
        res.json(boards)
    }catch(err){
        res.status(400).json(err);
    }
}

const create = async (req: Request, res: Response) => {
    try{
        const board = {
            boardname: req.body.boardname
        }

        const result = await store.create(board as Board)

        res.status(201).json(result)
    }catch(err){
        res.status(400).json(err);
    }
}

const destroy = async (req: Request, res: Response) => {
    try{
        await store.delete(+(req.query.bid!))
        res.status(200).json()
    }catch(err){
        res.status(400).json(err)
    }
}

const update = async (req: Request, res: Response) => {
    try{
        const board = {
            bid: +req.params.bid,
            boardname: req.body.boardname
        }
        await store.update(board as Board)
        res.status(200).json()
    }catch(err){
        res.status(400).json(err)
    }
}

const boards_routes = (app: express.Application) => {
	app.get('/boards', verifyAuthToken, index)
    app.post('/boards', verifyAuthToken, create)
    app.delete('/boards', verifyAuthToken, destroy)
    app.patch('/boards/:bid', verifyAuthToken, update)
}

export default boards_routes