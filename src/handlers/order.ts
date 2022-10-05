import { Order, OrderStore } from '../models/order'
import express, { Request, Response } from 'express'
import { verifyAuthToken } from './user'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config();
const { TOKEN_SECRET } = process.env
const secretToken = TOKEN_SECRET;

const store = new OrderStore()

const index = async (_req: Request, res: Response) => {
    try{
        const orders = await store.index()
        res.json(orders)
    }catch(err){
        res.status(400).json(err);
    }
}

const show = async (req: Request, res: Response) => {
    try{
        const order = await store.show(req.params.id);
        res.json(order);
    }catch(err){
        res.status(400).json(err);
    }
}

const create = async (req: Request, res: Response) => {
    try{
        const authorizationHeader = req.headers.authorization
        const token = authorizationHeader?.split(' ')[1]

        const decoded = jwt.verify(token as string, secretToken as string)
        const userId = (decoded as any).user.user_id
        const orderStatus = 'active'

        const order = {
            user_id: userId,
            order_status: orderStatus,
        };

        const result = await store.create((order as Order))
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

const addProduct = async (req: Request, res: Response) => {
    try{
        const quantity: number = parseInt(req.body.quantity)
        const orderId: string = req.body.order_id
        const productId: string = req.body.product_id
        
        const result = await store.addProduct(quantity, orderId, productId)
        res.status(201).json(result)
    }catch(err){
        res.status(400).json(err);
    }
}

const showCurrentOrderByUser = async (req: Request, res: Response) => {
    try{
        const result = await store.showCurrentOrderByUser(req.params.id);
        res.json(result);
    }catch(err){
        res.status(400).json(err);
    }
}

const orders_routes = (app: express.Application) => {
	// app.get('/orders', index)
    app.get('/orders/:id', verifyAuthToken, showCurrentOrderByUser)
    app.post('/orders', create)
    app.post('/orders/addProduct', verifyAuthToken, addProduct)
    // app.delete('/orders', destroy)
}

export default orders_routes