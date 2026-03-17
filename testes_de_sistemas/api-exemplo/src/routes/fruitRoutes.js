import express from 'express'
import { fruitService } from '../services/fruitService.js'

const route = express.Router()

route.get("/", (req, res) => {
    res.json(fruitService.getAll())
})

route.get("/:id", (req, res) => {
    const { id } = req.params
    const fruit = fruitService.getById(id)

    if (!fruit) {
        res.status(404).json({ message: "Fruta não encontrada" })
    }

    res.json(fruit)
})

export default route