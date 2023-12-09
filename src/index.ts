import morgan from 'morgan'
import express, { Application } from 'express'
import { dev } from './config'
import { errorHandler } from './middleware/errorHandler'
import productRouter from './routers/productRouters'
import categoryRouter from './routers/categoryRouters'
import userRouter from './routers/userRouter'
import { connectDB } from './config/db'
import { createHttpError } from './util/createHttpError'


const app: Application = express()
const port: number = dev.app.port

app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`listening on ${port}`)
  connectDB()
})
app.use('/api/products', productRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/users', userRouter)

app.use((res, req, next) => {
  const error = createHttpError(404, "Router no found")
  next(error)
})

app.use(errorHandler)
