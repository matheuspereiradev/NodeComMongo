//iniciandomodulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')
//const mongoose = require('mongoose')
const aplicacao = express()
const PORT = 3000
const admin = require('./routes/admin')
const path = require('path')

//configuraçoes
    //bodyparser
    aplicacao.use(bodyparser.urlencoded({extended:true}))
    aplicacao.use(bodyparser.json())
    //handlebars
    aplicacao.engine('handlebars',handlebars({defaultlayout:'main'}))
    aplicacao.set('view engine','handlebars')
    //mongoose

    //arquivo estatico
    aplicacao.use(express.static(path.join(__dirname,"public")))
//rotas
    aplicacao.use('/admin',admin)//todas as rotas desse grupo de rotas tem o seguinte prefixo

//outros
aplicacao.listen(PORT,()=>{
    console.log('rodando')
})