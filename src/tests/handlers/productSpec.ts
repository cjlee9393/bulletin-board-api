import { expect } from 'chai';
import app from '../../server'
import supertest from 'supertest'
import dotenv from 'dotenv'

dotenv.config()
const token_auth = process.env.TOKEN_AUTH
const request = supertest(app)

describe('Products API Endpoints', () => {
    it('Create: \'products\' [POST] should create data to db', (done) => {
        const name = 'productSpec'
        const price = '0'

        request
            .post('/products')
            .send({
                name: name,
                price: price
            })
            .set('Authorization', `bearer ${token_auth}`)
            .expect(201)
            .then((res) => {
                expect(res.body.name).to.equal(name)
                return done()
            })
            .catch((err) => {
                throw err
            })
    })

    it('Index: \'products\' [GET] should get data from db', (done) => {
        const name = 'name'

        request
            .get('/products')
            .expect(200)
            .then((res) => {
                expect(res.body[0].name).to.equal(name)
                return done()
            })
            .catch((err) => {
                throw err
            })               
    })

    it('Show: \'products/:id\' [GET] should get a data from db', (done) => {
        const id = '1'
        const name = 'name'

        request
            .get(`/products/${id}`)
            .expect(200)
            .then((res) => {
                expect(res.body.name).to.equal(name)
                return done()
            })
            .catch((err) => {
                throw err
            })               
    })
})