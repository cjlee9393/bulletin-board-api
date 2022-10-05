import { DashboardQueries } from '../services/dashboard'
import express, { Request, Response } from 'express'

const queries = new DashboardQueries()

const productsInOrders = async (_req: Request, res: Response) => {
    try{
        const result = await queries.productsInOrders()
        res.json(result)
    }catch(err){
        res.status(400).json(err);
    }
}

const usersWithOrders = async (_req: Request, res: Response) => {
    try{
        const result = await queries.usersWithOrders()
        res.json(result)
    }catch(err){
        res.status(400).json(err);
    }
}

const mostExpensiveProducts = async (_req: Request, res: Response) => {
    try{
        const result = await queries.mostExpensiveProducts()
        res.json(result)
    }catch(err){
        res.status(400).json(err);
    }
}

const dashboard_routes = (app: express.Application) => {
	app.get('/products-in-orders', productsInOrders)
    app.get('/users-with-orders', usersWithOrders)
    app.get('/most-expensive-products', mostExpensiveProducts)
}

export default dashboard_routes