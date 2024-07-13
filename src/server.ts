import express from 'express'
import { readFile, writeFile } from 'fs/promises'
import z from 'zod'
const server = express()
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.get('/', async (req, res) => {
    try{
        const VaLueTxt = await (readFile('./valor.txt', { encoding: 'utf-8' }))
        res.json({ pong: JSON.parse(VaLueTxt) })
    }
    catch{
        res.json({pong:false})
    }
})
server.post('/', async (req, res) => {
    const zodRequire = z.object({
        nome: z.string().min(2),
        email: z.string().email(),
        valor: z.number().min(18)

    })
    const valorRight = zodRequire.safeParse(req.body)
    if (!valorRight.success) {
        return res.json({ status: 'error' })
    }
    else {
        const valorSplit = valorRight.data
        const fs = require('fs')

        if (!fs.existsSync('./valor.txt')) {
            await writeFile('./valor.txt', JSON.stringify([valorSplit]))
        }
        else{
            const readValor = await readFile('./valor.txt', { encoding: 'utf-8' })
            var readValorJson = JSON.parse(readValor)
            readValorJson.push(valorRight.data)
            
            await writeFile('./valor.txt', JSON.stringify(readValorJson,null,2),{encoding:'utf-8'})
        }
        res.status(201).json({ status: 'tudo certo' })
    }
})
server.listen(80, () => {
    console.log('rodando http://localhost/')
})
