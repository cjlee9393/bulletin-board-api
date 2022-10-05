import { UserStore } from '../../models/user';
import { expect, assert } from 'chai';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const { TOKEN_SECRET } = process.env
const secretToken = TOKEN_SECRET;

const store = new UserStore()

describe("User Store Model", () => {
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

    it('should have an authenticate method', () => {
        expect(store.authenticate).to.not.be.undefined;
    });

    it('should create data to db', async () => {
        const first_name = 'modelsUserSpec'
        const last_name = 'last_name'
        const username = 'modelsUserSpec'
        const password = 'password_digest'

        const result = await store.create({
            id: '',
            first_name: first_name,
            last_name: last_name,
            username: username,
            password: password
        });
        
        expect(result.first_name).to.equal(first_name);
    });

    it('should not create data to db if username already exists', async () => {
        const first_name = 'first_name'
        const last_name = 'last_name'
        const username = 'username'
        const password = 'password_digest'

        try{
            await store.create({
                id: '',
                first_name: first_name,
                last_name: last_name,
                username: username,
                password: password
            })
            assert.fail(0, 1, 'UsernameAlreadyExistError not thrown')
        }catch(err){
            expect((err as Error).name).to.be.equal('UsernameAlreadyExistError')
        }      
    });

    it('should index data from db', async () => {
        const first_name = 'first_name' // added from data.sql

        let rows = await store.index();

        expect(rows[0].first_name).to.equal(first_name);
    });

    it('should show a data from db', async () => {
        const id = '1' // added from data.sql
        const first_name = 'first_name'

        const result = await store.show(id);

        expect(result.first_name).to.equal(first_name);
    });

    it('should delete a data from db', async () => {
        const id = '2' // added from data.sql

        await store.delete(id);

        let rows = await store.index();

        for (let row of rows){
            expect(row.id).to.not.be.oneOf([id])
        }
    });

    it('should provide user authentication tokens', async () => {
        const username = 'username'
        const password_digest = 'password_digest'

        const token = await store.authenticate(username, password_digest);

        // console.log(`valid JWT: ${token}`)

        try{
            jwt.verify(token as string, secretToken as string)
            expect(0).to.equal(0);
        }catch(err){
            console.log('error: ', err);
            expect(0).to.equal(1);
        }
    });
});