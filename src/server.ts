import express from 'express'
import cors from 'cors'

import orders_routes from './handlers/order'
import products_routes from './handlers/product'
import dashboard_routes from './handlers/dashboard'
import users_routes from './handlers/user'

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

// middleware 1
app.use(express.json())

// middleware 2
const corsOptions = {
	origin: 'http://someotherdomain.com',
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

orders_routes(app)
products_routes(app)
users_routes(app)
dashboard_routes(app)

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})

export default app