import { ProductStore } from '../../models/product';
import { expect } from 'chai';

const store = new ProductStore()

describe("Product Store Model", () => {
    it('should have an index method', () => {
        expect(store.index).to.not.be.undefined;
    });

    it('should have an show method', () => {
        expect(store.show).to.not.be.undefined;
    });

    it('should have an create method', () => {
        expect(store.create).to.not.be.undefined;
    });

    it('should have an delete method', () => {
        expect(store.delete).to.not.be.undefined;
    });

    it('should create data to db', async () => {
        const name = 'productSpec' // added from data.sql
        const price = 1;

        const result = await store.create({
            id: '',
            name: name,
            price: price
        });
 
        expect(result.name).to.equal(name);
    });

    it('should index data from db', async () => {
        const name = 'name' // added from data.sql

        const rows = await store.index();
        expect(rows[0].name).to.equal(name);
    });

    it('should delete data from db', async () => {
        let id = '2' // added from data.sql

        await store.delete(id);

        const rows = await store.index();

        for (let row of rows){
            expect(row.id).to.not.be.oneOf([id])
        }
    });
});