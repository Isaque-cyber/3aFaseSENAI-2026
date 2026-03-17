import express from 'express'
import route from './routes/fruitRoutes.js'

const PORT = 3000
const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Bem vindo!")
})

// rotas
app.use('/fruits', route)

app.listen(PORT, () => {
    console.log(`API rodando em: http://localhost:${PORT}`)
})
