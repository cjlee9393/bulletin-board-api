import client from '../database'

export type Comment = {
    cid : number,
    content: string
}

export class CommentStore {
    async show(did: number): Promise<Document[]> {
        try{
            const conn = await client.connect()
            const sql = `SELECT t4.wid, t1.did, t3.cid, t4.username, t3.content\
                         FROM document t1\
                         INNER JOIN writerCommentDocument t2 ON t1.did=t2.did\
                         INNER JOIN comment t3 ON t2.cid=t3.cid\
                         INNER JOIN writer t4 ON t2.wid=t4.wid\
                         WHERE t1.did=($1)`;
            const result = await conn.query(sql, [did])
            conn.release()
            return result.rows
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async create(wid: number, did: number, c: Comment): Promise<void> {
        try{
            const conn = await client.connect()

            await conn.query('BEGIN;')

            await conn.query('INSERT INTO comment(content)\
                              VALUES($1);', [c.content])

            await conn.query('INSERT INTO writerCommentDocument(wid, cid, did)\
                              VALUES (($1), currval(\'comment_cid_seq\'), ($2));', [wid, did])

            await conn.query('COMMIT;')

            conn.release()
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async delete(cid: number): Promise<void> {
        try{
            const conn = await client.connect()
            const sql = 'DELETE FROM comment\
                         WHERE cid=($1);'
            await conn.query(sql, [cid])
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async update(c: Comment): Promise<void> {
        try{
            const conn = await client.connect()
            const sql = 'UPDATE comment\
                         SET content=($1)\
                         WHERE cid=($2);'
            await conn.query(sql, [c.content, c.cid])
            conn.release()
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }
}