const express = require('express')
const rotas = express.Router()

rotas.get('/',(req,res)=>{
    res.render('admin/index')
})

rotas.get('/posts',(req,res)=>{
    res.send('pagina de posts')
})

module.exports=rotas