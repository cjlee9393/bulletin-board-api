import { expect } from 'chai';
import app from '../../server'
import supertest from 'supertest'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const { TOKEN_AUTH, TOKEN_SECRET } = process.env
const token_auth = TOKEN_AUTH
const token_secret = TOKEN_SECRET

const request = supertest(app)

describe('Users API Endpoints', () => {
    it('Create: \'users\' [POST] should create data to db', (done) => {
        const firstName = 'handlersUserSpec'
        const lastName = 'lastName'
        const username = 'handlersUserSpec'
        const password = 'password_digest'

        request
            .post('/users')
            .send({
                first_name: firstName,
                last_name: lastName,
                username: username,
                password: password
            })
            .set('Authorization', `bearer ${token_auth}`)
            .expect(201)
            .then((res) => {
                const decoded = jwt.verify(res.body.token_auth as string, token_secret as string)
                expect((decoded as any).user.first_name).to.equal(firstName)
                return done()
            })
            .catch((err) => {
                throw err
            })
    })

    it('Index: \'users\' [GET] should get data from db', (done) => {
        const firstName = 'first_name' // added in data.sql

        request
            .get('/users')
            .set('Authorization', `bearer ${token_auth}`)
            .expect(200)
            .then((res) => {
                expect(res.body[0].first_name).to.equal(firstName)
                return done()
            })
            .catch((err) => {
                throw err
            })               
    })

    it('Show: \'users/:id\' [GET] should get a data from db', (done) => {
        const id = '1'
        const firstName = 'first_name'

        request
            .get(`/users/${id}`)
            .set('Authorization', `bearer ${token_auth}`)
            .expect(200)
            .then((res) => {
                expect(res.body.first_name).to.equal(firstName)
                return done()
            })
            .catch((err) => {
                throw err
            })               
    })
})