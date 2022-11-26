import client from '../database'

export type Board = {
    bid : number,
    boardname : string
}

export class BoardStore {
    async index(): Promise<Board[]> {
        try{
            const conn = await client.connect()
            const sql = 'SELECT * FROM board;'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async create(w: Board): Promise<Board> {
        try{
            const conn = await client.connect()
            const sql = 'INSERT INTO board(boardname)\
                         VALUES($1) RETURNING *;'
            const result = await conn.query(sql, [w.boardname])
            const board = result.rows[0]
            conn.release()
            return board
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async delete(bid: number): Promise<void> {
        try{
            const conn = await client.connect()

            await conn.query('BEGIN;')

            await conn.query('DELETE FROM document\
                              WHERE did in (SELECT did\
						                    FROM writerDocumentBoard\
							                WHERE bid=($1));', [bid])

            await conn.query('DELETE FROM board\
                              WHERE bid=($1);', [bid])

            await conn.query('COMMIT;')

            conn.release()

        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async update(b: Board): Promise<void> {
        try{
            const conn = await client.connect()
            const sql = 'UPDATE board\
                         SET boardname=($1)\
                         WHERE bid=($2);'
            await conn.query(sql, [b.boardname, b.bid])
            conn.release()

        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }
}