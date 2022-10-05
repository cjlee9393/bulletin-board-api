import client from '../database'

export type Book = {
    id : Number;
    title: String;
    author: String;
    total_pages: Number;
    type: String;
    summary: String;
}

export class BookStore {
    async index(): Promise<Book[]> {
        try{
            const conn = await client.connect()
            const sql = 'SELECT * FROM books'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }
    
    async create(b: Book): Promise<Book> {
        try{
            const conn = await client.connect()
            const sql = 'INSERT INTO books (title, author, total_pages, type, summary) VALUES($1, $2, $3, $4, $5) RETURNING *'
            const result = await conn.query(sql, [b.title, b.author, b.total_pages, b.type, b.summary])
            const book = result.rows[0]
            conn.release()
            return book
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async delete(id: string): Promise<void> {
        try{
            const conn = await client.connect()
            const sql = 'DELETE FROM books WHERE id=($1)'
            const result = await conn.query(sql, [id])
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }
}