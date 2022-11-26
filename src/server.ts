import express from 'express'
import cors from 'cors'

import writers_routes from './handlers/writer'
import boards_routes from './handlers/board'
import documents_routes from './handlers/document'
import comments_routes from './handlers/comment'

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

// middleware 1
app.use(express.json())

// middleware 2
const corsOptions = {
	origin: 'http://localhost:8080',
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

writers_routes(app)
boards_routes(app)
documents_routes(app)
comments_routes(app)

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})

export default app