import client from '../database'

export type Product = {
    id : string;
    name : string;
    price : Number;
}

export class ProductStore {
    async index(): Promise<Product[]> {
        try{
            const conn = await client.connect()
            const sql = 'SELECT * FROM products'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async show(id: string): Promise<Product> {
        try {
            const sql = 'SELECT * FROM products WHERE id=($1)'
            // @ts-ignore
            const conn = await client.connect()
    
            const result = await conn.query(sql, [id])
    
            conn.release()
    
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not get product ${id}. Error: ${err}`)
        }
    }
    
    async create(p: Product): Promise<Product> {
        try{
            const conn = await client.connect()
            const sql = 'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *'
            const result = await conn.query(sql, [p.name, p.price])
            const product = result.rows[0]
            conn.release()
            return product
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async delete(id: string): Promise<void> {
        try{
            const conn = await client.connect()
            const sql = 'DELETE FROM products WHERE id=($1)'
            const result = await conn.query(sql, [id])

        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }
}