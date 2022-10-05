import client from '../database'

export type Order = {
    id : string;
    order_status : string;
    user_id : string;
}

export type OrderProduct = {
    id : string,
    quantity: number,
    order_id: string,
    product_id: number
}

export class OrderStore {
    async index(): Promise<Order[]> {
        try{
            const conn = await client.connect()
            const sql = 'SELECT * FROM orders'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }
    async show(id: string): Promise<Order> {
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)'
            // @ts-ignore
            const conn = await Client.connect()
    
            const result = await conn.query(sql, [id])
    
            conn.release()
    
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not get article ${id}. Error: ${err}`)
        }
    }
    
    async create(o: Order): Promise<Order> {
        try{
            const conn = await client.connect()
            const sql = 'INSERT INTO orders (order_status, user_id) VALUES($1, $2) RETURNING *'
            const result = await conn.query(sql, [o.order_status, o.user_id])
            const order = result.rows[0]
            conn.release()
            return order
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async delete(id: string): Promise<void> {
        try{
            const conn = await client.connect()
            const sql = 'DELETE FROM orders WHERE id=($1)'
            const result = await conn.query(sql, [id])

        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async addProduct(quantity: number, orderId: string, productId: string): Promise<OrderProduct> {
        try{
            const conn = await client.connect()
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
            const result = await conn.query(sql, [quantity, orderId, productId])
            const orderProduct = result.rows[0]
            conn.release()
            return orderProduct
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async delProduct(id: string): Promise<void> {
        try{
            const conn = await client.connect()
            const sql = 'DELETE FROM order_products WHERE id=($1)'
            const result = await conn.query(sql, [id])

        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async showCurrentOrderByUser(id: string): Promise<any[][]> {
        try{
            const results = []

            // get array of order_id from user_id 
            const sql = 'SELECT user_id FROM orders WHERE user_id=($1) AND order_status=\'active\''

            const conn = await client.connect()

            const result = await conn.query(sql, [id])

            for (let row of result.rows){
                const sql = 'SELECT products.name, products.price, order_products.quantity FROM order_products INNER JOIN products ON order_products.product_id=products.id WHERE order_products.order_id=($1)'
                
                const result = await conn.query(sql, [row.user_id])

                results.push(result.rows)
            }

            return results;
        } catch (err) {
            throw new Error(`Could not get current order by user ${id}. Error: ${err}`)
        }
    }
}