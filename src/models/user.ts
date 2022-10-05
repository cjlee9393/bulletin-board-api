import Client from '../database'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

export type User = {
  id?: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
}

dotenv.config();
const { BCRYPT_PASSWORD, SALT_ROUNDS, TOKEN_SECRET } = process.env
const pepper = BCRYPT_PASSWORD;
const saltRounds = SALT_ROUNDS;
const tokenSecret = TOKEN_SECRET;

export class UserStore {
    async index(): Promise<User[]> {
        try {
          // @ts-ignore
          const conn = await Client.connect()
          const sql = 'SELECT * FROM users'
      
          const result = await conn.query(sql)
      
          conn.release()
      
          return result.rows 
        } catch (err) {
          throw new Error(`Could not get users. Error: ${err}`)
        }
    }

    async show(id: string): Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE id=($1)'
            // @ts-ignore
            const conn = await Client.connect()
    
            const result = await conn.query(sql, [id])
    
            conn.release()
    
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not get user. Error: ${err}`)
        }
    }
    
      async create(user: User): Promise<User> {
        // check UsernameAlreadyExistError
        const conn = await Client.connect()
        const sql = 'SELECT * FROM users WHERE username=($1)'

        const result = await conn.query(sql, [user.username])

        if (result.rows.length > 0){
            const err = new Error()
            err.message = 'username should not be already exist'
            err.name = 'UsernameAlreadyExistError'
            throw err
        }

        // create
        try {
            const hash = bcrypt.hashSync(user.password + pepper, parseInt(saltRounds as string));

            const sql = 'INSERT INTO users (first_name, last_name, username, password_digest) VALUES($1, $2, $3, $4) RETURNING *'
            // @ts-ignore
    
            const result = await conn.query(sql, [user.first_name, user.last_name, user.username, hash])
    
            const newUser = result.rows[0]
    
            conn.release()
    
            return newUser;
        } catch (err) {
            throw new Error(`Could not add user. Error: ${err}`)
        }
    }
    
      async delete(id: string): Promise<User> {
        try {
          const sql = 'DELETE FROM users WHERE id=($1)'
            // @ts-ignore
            const conn = await Client.connect()
    
            const result = await conn.query(sql, [id])
    
            const article = result.rows[0]
    
            conn.release()
    
            return article  
        } catch (err) {
            throw new Error(`Could not delete user. Error: ${err}`)
        }
    }

    async authenticate(username: string, password: string): Promise<string | null> {
        const conn = await Client.connect()
        const sql = 'SELECT * FROM users WHERE username=($1)'

        const result = await conn.query(sql, [username])

        // console.log(password + pepper);

        if (result.rows.length) {
            const user = result.rows[0]

            // console.log(user)

            if (bcrypt.compareSync(password+pepper, user.password_digest)) {
                user.password_digest = 'password_digest';

                const token = jwt.sign({user: user}, tokenSecret as string);

                return token
            }
        }

        return null
    }
}