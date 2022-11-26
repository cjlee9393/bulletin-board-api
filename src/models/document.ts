import client from '../database'

export type Document = {
    did : number,
    documentname : string,
    content: string
}

export class DocumentStore {
    async show(bid: number): Promise<Document[]> {
        try{
            const conn = await client.connect()
            const sql = 'SELECT t2.wid, t1.bid, t3.did, t3.documentname, t3.content\
                         FROM board t1\
                         INNER JOIN writerDocumentBoard t2 ON t1.bid=t2.bid\
                         INNER JOIN document t3 ON t2.did=t3.did\
                         WHERE t1.bid=($1);'
            const result = await conn.query(sql, [bid])
            conn.release()
            return result.rows
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async create(wid: number, bid: number, d: Document): Promise<void> {
        try{
            const conn = await client.connect()

            await conn.query('BEGIN;')

            await conn.query('INSERT INTO document(documentname, content)\
                              VALUES($1, $2);', [d.documentname, d.content])

            await conn.query('INSERT INTO writerDocumentBoard(wid, did, bid)\
                              VALUES (($1), currval(\'document_did_seq\'), ($2));', [wid, bid])

            await conn.query('COMMIT;')
            conn.release()
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async delete(did: number): Promise<void> {
        try{
            const conn = await client.connect()
            const sql = 'DELETE FROM document\
                         WHERE did=($1);'
            await conn.query(sql, [did])
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async update(d: Document): Promise<void> {
        try{
            const conn = await client.connect()
            const sql = 'UPDATE document\
                         SET documentname=($2), content=($3)\
                         WHERE did=($1);'
            await conn.query(sql, [d.did, d.documentname, d.content])
            conn.release()

        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }
}