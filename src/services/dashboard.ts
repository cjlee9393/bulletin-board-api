import client from '../database'

export class DashboardQueries {
    async productsInOrders(): Promise<{id: Number, name: String, price: Number, quantity: Number, order_id: Number}[]> {
        try{
            const conn = await client.connect()
            const sql = 'SELECT products.id, name, price, quantity, order_id FROM products INNER JOIN order_products ON products.id = order_products.product_id'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async usersWithOrders(): Promise<{id: Number, username: String, status: Number}[]> {
        try{
            const conn = await client.connect()
            const sql = 'SELECT users.id, username, status FROM users INNER JOIN orders ON users.id=orders.user_id'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async mostExpensiveProducts(): Promise<{id: Number, name: String, price: Number}[]> {
        try{
            const conn = await client.connect()
            const sql = 'SELECT * FROM products ORDER BY price DESC LIMIT 5'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }
}