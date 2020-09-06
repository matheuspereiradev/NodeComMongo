const express = require('express')
const rotas = express.Router()

const mongoose = require('mongoose')//importa mongoose
require('../models/Categoria')//importa o model
const modelCategoria = mongoose.model('categoria')//importa schema

rotas.get('/',(req,res)=>{
    res.render('admin/index')
})
//================CATEGORIAS========================
rotas.get('/categorias',(req,res)=>{
    res.render('admin/categorias')
})

rotas.get('/categorias/cadastrar',(req,res)=>{
    res.render('admin/addcategoria')
})

rotas.post('/categorias/nova',(req,res)=>{
    const categoriaNova = {
        nome:req.body.nome,
        slug:req.body.slug
    }

    new modelCategoria (categoriaNova).save().then(()=>{
        res.redirect('/admin/categorias')
    }).catch((e)=>{
        res.send('erro '+e)
    })
})

//===============/CATEGORIAS=======================
rotas.get('/posts',(req,res)=>{
    res.send('pagina de posts')
})

module.exports=rotas