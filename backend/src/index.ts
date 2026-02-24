import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import ticketsRouter from './routes/tickets.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.use('/api/tickets', ticketsRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
