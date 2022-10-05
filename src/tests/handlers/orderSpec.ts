import { expect } from 'chai';
import app from '../../server'
import supertest from 'supertest'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const token_auth = process.env.TOKEN_AUTH
const token_secret = process.env.TOKEN_SECRET
const request = supertest(app)

describe('Orders API Endpoints', () => {
    it('Create: \'orders\' [POST] should create data to db', (done) => {
        const decoded = jwt.verify(token_auth as string, token_secret as string)
        const userId = (decoded as any).user.user_id
        const orderStatus = 'active'

        request
            .post(`/orders`)
            .set('Authorization', `bearer ${token_auth}`)
            .expect(201)
            .then((res) => {
                expect(res.body.userId).to.be.equal(userId)
                expect(res.body.order_status).to.be.equal(orderStatus)
                return done()
            })
            .catch((err) => {
                throw err
            })               
    })

    it('Add product to order: \'orders/addProduct\' [POST] should create data to db', (done) => {
        const quantity = '0'
        const orderId = '1' // already added in data.sql
        const productId = '1'

        request
            .post(`/orders/addProduct`)
            .send({
                quantity: quantity,
                order_id: orderId,
                product_id: productId
            })
            .set('Authorization', `bearer ${token_auth}`)
            .expect(201)
            .then((res) => {
                expect(res.body.quantity).to.be.equal(+quantity)
                expect(res.body.order_id).to.be.equal(orderId)
                expect(res.body.product_id).to.be.equal(productId)
                return done()
            })
            .catch((err) => {
                throw err
            })               
    })

    it('Current Order by user \'orders/:id\' [GET] should get current order by user from db', (done) => {
        const userId = '1'; // added in data.sql
        const name = 'name'
        const price = 0
        const quantity = 0

        request
            .get(`/orders/${userId}`)
            .set('Authorization', `bearer ${token_auth}`)
            .expect(200)
            .then((res) => {
                for (let rows of res.body){
                    for (let row of rows){
                        expect(row.name).to.be.equal(name)
                        expect(row.price).to.be.equal(price)
                        expect(row.quantity).to.be.equal(quantity)
                    }
                }
                return done()
            })
            .catch((err) => {
                throw err
            })               
    })
})