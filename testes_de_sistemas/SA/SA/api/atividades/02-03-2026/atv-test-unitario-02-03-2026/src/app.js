
import express from 'express'
import { createUser } from './userService'

export const app = express()

app.use(express.json())

app.post('/user', (req,res) => {

    try{
        const user = createUser(req.body)
        res.status(201).json(user)
    }catch(error){
        res.status(400).json({error: error.message})
    }
})




