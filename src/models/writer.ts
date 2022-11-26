import client from '../database'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { existsSync } from 'fs'

export type Writer = {
    wid : number,
    username : string,
    password : string,
    point : number
}

dotenv.config();
const { BCRYPT_PASSWORD, TOKEN_SECRET, SALT_ROUNDS } = process.env
const pepper = BCRYPT_PASSWORD;
const tokenSecret = TOKEN_SECRET;
const saltRounds = SALT_ROUNDS;

export class WriterStore {
    async index(): Promise<Writer[]> {
        try{
            const conn = await client.connect()
            const sql = 'SELECT * FROM writer;'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }
    async show(wid: number): Promise<Writer> {
        try {
            const sql = 'SELECT * FROM writer\
                         WHERE wid=($1);'
            // @ts-ignore
            const conn = await client.connect()
    
            const result = await conn.query(sql, [wid])
    
            conn.release()
    
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not get writer ${wid}. Error: ${err}`)
        }
    }

    async create(w: Writer): Promise<Writer> {
        // check UsernameAlreadyExistError
        const conn = await client.connect()
        const sql = 'SELECT * FROM writer WHERE username=($1)'

        const result = await conn.query(sql, [w.username])

        if (result.rows.length > 0){
            const err = new Error()
            err.message = 'username should not be already exist'
            err.name = 'UsernameAlreadyExistError'
            throw err
        }

        // create
        try {
            const hash = bcrypt.hashSync(w.password + pepper, parseInt(saltRounds as string));

            const sql = 'INSERT INTO writer (username, password) VALUES($1, $2) RETURNING *'
            // @ts-ignore
    
            const result = await conn.query(sql, [w.username, hash])
    
            const newWriter = result.rows[0]
    
            conn.release()
    
            return newWriter;
        } catch (err) {
            throw new Error(`Could not add user. Error: ${err}`)
        }
    }

    async delete(wid: number): Promise<void> {
        try{
            const conn = await client.connect()
            const sql = 'DELETE FROM writer\
                         WHERE wid=($1);'
            await conn.query(sql, [wid])
            
            conn.release()
            
            return

        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }

    async update(w: Writer): Promise<void> {
        // check if exist
        const conn = await client.connect()
        const sql = 'SELECT * FROM writer WHERE wid=($1);'
        const result = await conn.query(sql, [w.wid])

        if (!result.rows.length){
            const err = new Error()
            err.message = 'writer should be exist'
            err.name = 'WriterNotExistError'
            throw err
        }

        if (!w.username && !w.password){
            const err = new Error()
            err.message = 'Patch body should be exist'
            err.name = 'PatchBodyNotExistError'
            throw err
        }
        
        try{
            if (w.username && !w.password){
                const sql = 'UPDATE writer\
                         SET username=($2)\
                         WHERE wid=($1);'
                await conn.query(sql, [w.wid, w.username])
            } else if (!w.username && w.password){
                const hash = bcrypt.hashSync(w.password + pepper, parseInt(saltRounds as string));

                const sql = 'UPDATE writer\
                         SET password=($2)\
                         WHERE wid=($1);'
                await conn.query(sql, [w.wid, hash])
            } else{
                const hash = bcrypt.hashSync(w.password + pepper, parseInt(saltRounds as string));

                const sql = 'UPDATE writer\
                         SET username=($2), password=($3)\
                         WHERE wid=($1);'
                await conn.query(sql, [w.wid, w.username, hash])
            }

            conn.release()

        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }

        return
    }

    async authenticate(username: string, password: string): Promise<Writer | null> {
        const conn = await client.connect()
        const sql = 'SELECT * FROM writer WHERE username=($1)'

        const result = await conn.query(sql, [username])

        if (result.rows.length) {
            const writer = result.rows[0]

            if (bcrypt.compareSync(password+pepper, writer.password)) {
                writer.password = 'password';

                const token = jwt.sign({writer: writer}, tokenSecret as string);

                writer['token_auth'] = token;

                return writer
            }
        }

        return null
    }

    async deliverPoint(srcId: number, dstId: number, point: number): Promise<void> {
        try{
            const conn = await client.connect()

            await conn.query('BEGIN;')

            await conn.query('UPDATE writer\
                              SET point=point-($1)\
                              WHERE wid=($2);', [point, srcId])

            await conn.query('UPDATE writer\
                              SET point=point+($1)\
                              WHERE wid=($2);', [point, dstId])

            await conn.query('COMMIT;')

            conn.release()
        }catch(error: unknown){
            throw new Error(`Error: ${error}`);
        }
    }
}