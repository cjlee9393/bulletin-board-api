import { Document, DocumentStore } from '../models/document'
import express, { Request, Response } from 'express'
import { verifyAuthToken } from './writer'

const store = new DocumentStore()

const show = async (req: Request, res: Response) => {
    try{
        const boards = await store.show(+req.params.bid!)
        res.json(boards)
    }catch(err){
        res.status(400).json(err);
    }
}

const create = async (req: Request, res: Response) => {
    try{
        const document = {
            documentname: req.body.documentname,
            content: req.body.content
        }

        const result = await store.create(+req.body.wid!, +req.body.bid!, document as Document);

        res.status(201).json(result);
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }
}

const destroy = async (req: Request, res: Response) => {
    try{
        await store.delete(+(req.query.did!))
        res.status(200).json()
    }catch(err){
        res.status(400).json(err)
    }
}

const update = async (req: Request, res: Response) => {
    try{
        console.log('req.body');
        console.log(req.body);
        
        const document = {
            did: +req.params.did,
            documentname: req.body.documentname,
            content: req.body.content
        }
        await store.update(document as Document)
        res.status(200).json()
    }catch(err){
        console.log(err)

        res.status(400).json(err)
    }
}

const documents_routes = (app: express.Application) => {
	app.get('/documents/:bid', verifyAuthToken, show)
    app.post('/documents', verifyAuthToken, create)
    app.delete('/documents', verifyAuthToken, destroy)
    app.patch('/documents/:did', verifyAuthToken, update)
}

export default documents_routes