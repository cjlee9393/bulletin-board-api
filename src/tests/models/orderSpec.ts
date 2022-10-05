import { OrderStore } from '../../models/order';
import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';
import { expect, assert } from 'chai';

const orderStore = new OrderStore()
const userStore = new UserStore()
const productStore = new ProductStore()

describe("Order Store Model", () => {
    it('should have an index method', () => {
        expect(orderStore.index).to.not.be.undefined;
    });

    it('should have an show method', () => {
        expect(orderStore.show).to.not.be.undefined;
    });

    it('should have an create method', () => {
        expect(orderStore.create).to.not.be.undefined;
    });

    it('should have an delete method', () => {
        expect(orderStore.delete).to.not.be.undefined;
    });

    it('should create data to db', async () => {
        const userId = '1' // added from data.sql
        const orderStatus = 'complete';

        const orderResult = await orderStore.create({
            id: '',
            order_status: orderStatus,
            user_id: userId as string
        });
 
        expect(orderResult.order_status).to.equal(orderStatus);
    });

    it('should index data from db', async () => {
        const userId = '1' // added from data.sql

        let orderRows = await orderStore.index();
        expect(orderRows[0].user_id).to.equal(userId);
    });

    it('should delete data from db', async () => {
        let orderId = '2' // added from data.sql

        await orderStore.delete(`${orderId}`);

        const orderRows = await orderStore.index();

        for (let orderRow of orderRows){
            expect(orderRow.id).to.not.be.oneOf([orderId])
        }
    });

    it('should add product to order', async () => {
        const orderId = '1';
        const productId = '1';

        const quantity = 0;
        const addProductResult = await orderStore.addProduct(quantity, orderId, productId);
        expect(addProductResult.quantity).to.equal(quantity);
        expect(addProductResult.order_id).to.equal(orderId);
        expect(addProductResult.product_id).to.equal(productId);
    });

    it('should del product from order', async () => {
        const orderProductId = '-15';

        try{
            await orderStore.delProduct(orderProductId);
        }catch(err){
            console.log('assert.fail()')
            assert.fail(0, 1, 'Error is thrown')
        }
    });

    it('should show current order by user', async () => {
        const userId = '1'; // added in data.sql
        const name = 'name'
        const price = 0
        const quantity = 0

        const arrs = await orderStore.showCurrentOrderByUser(userId);

        for (let rows of arrs){
            for (let row of rows){
                expect(row.name).to.be.equal(name)
                expect(row.price).to.be.equal(price)
                expect(row.quantity).to.be.equal(quantity)
            }
        }
    });
});