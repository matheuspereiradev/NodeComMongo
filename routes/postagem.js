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
       res.render('postagem/verpost',{postagem:post.toJSON()})
         
    }).catch((e)=>{
        req.flash('error_msg','Erro ao carregar postagem') 
        res.redirect('/') 
    })
})

rotas.get('/categorias',(req,res)=>{
    modelCategoria.find().then((categoria)=>{
        res.render('categoria/categorias',{categorias:categoria.map( categoria => categoria.toJSON())})
    }).catch((e)=>{
        req.flash('error_msg','Erro ao carregar categorias') 
        res.redirect('/') 
    })
})

rotas.get('/categorias/:slug',(req,res)=>{
    modelCategoria.findOne({slug:req.params.slug}).then((c)=>{

        if(c!=null){
            modelPostagem.find({categoria:c._id}).then((post)=>{
                res.render('categoria/postagem',{postagens:post.map( post => post.toJSON()), categoria:c.toJSON()})
            }).catch((e)=>{
                req.flash('error_msg','Erro ao carregar postagem') 
                res.redirect('/') 
            })
        }else{
            req.flash('error_msg','Categoria nao encontrada') 
            res.redirect('/') 
        }
        
        
    }).catch((e)=>{
        req.flash('error_msg','Erro ao carregar categorias') 
        res.redirect('/') 
    })
})


module.exports=rotas