const express = require('express')
const rotas = express.Router()

const mongoose = require('mongoose')//importa mongoose
require('../models/Categoria')//importa o model
const modelCategoria = mongoose.model('categoria')//importa schema
require('../models/Postagem')
const modelPostagem = mongoose.model('postagem')


rotas.get('/',(req,res)=>{
    res.send('sakls')
})

rotas.get('/ler/:slug',(req,res)=>{
    modelPostagem.findOne({slug:req.params.slug}).populate('categoria').then((post)=>{
       console.log(post)
       res.render('postagem/verpost',{postagem:post.toJSON()})
         
    }).catch((e)=>{
        req.flash('error_msg','Erro ao carregar postagem') 
        res.redirect('/') 
    })
})


module.exports=rotas