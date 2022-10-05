import { Product, ProductStore } from '../models/product'
import express, { Request, Response } from 'express'
import { verifyAuthToken } from './user'

const store = new ProductStore()

const index = async (_req: Request, res: Response) => {
    try{
        const products = await store.index()
        res.json(products)
    }catch(err){
        res.status(400).json(err);
    }
}

const show = async (req: Request, res: Response) => {
    try{
        const product = await store.show(req.params.id);
        res.json(product);
    }catch(err){
        console.log(err)
        res.status(400).json(err);
    }
}

const create = async (req: Request, res: Response) => {
    try{
        const product = {
            name: req.body.name,
            price: req.body.price
        };

        const result = await store.create(product as Product)
        res.status(201).json(result)
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

const products_routes = (app: express.Application) => {
	app.get('/products', index)
    app.get('/products/:id', show)
    app.post('/products', verifyAuthToken, create)
    app.delete('/products', destroy)
}

export default products_routes