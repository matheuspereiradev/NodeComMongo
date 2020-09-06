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
    modelCategoria.find().then((cat)=>{
        res.render('admin/categorias',{categorias:cat.map(cat => cat.toJSON())})
    }).catch((e)=>{
        req.flash('error_msg','Erro ao listar categoria. '+e) 
        res.redirect('/admin')
    })
    
})

rotas.get('/categorias/cadastrar',(req,res)=>{
    res.render('admin/addcategoria')
})

rotas.post('/categorias/nova',(req,res)=>{

    let erros=[]
    if(!req.body.nome||req.body.nome==undefined||req.body.nome==null){
        erros.push({texto:'nome inválido'})
    }
    if(!req.body.slug||req.body.slug==undefined||req.body.slug==null){
        erros.push({texto:'slug inválido'})
    }
    
    if(erros.length>0){
        res.render('admin/addcategoria',{erros:erros})
    }else{
        const categoriaNova = {
            nome:req.body.nome,
            slug:req.body.slug
        }
    
        new modelCategoria (categoriaNova).save().then(()=>{
            req.flash('success_msg','Categoria cadastrada com sucesso')    
            res.redirect('/admin/categorias')
        }).catch((e)=>{
            req.flash('error_msg','Erro ao cadastrar categoria'+e) 
            res.redirect('/admin')
        })
    } 
})

rotas.get('/categorias/editar/:id',(req,res)=>{
    modelCategoria.findOne({_id:req.params.id}).then((cat)=>{
        res.render('admin/edtcategoria', {categoria:cat.toJSON()})
    }).catch((e)=>{
        req.flash('error_msg','Categoria nao encontrada'+e) 
        res.redirect('/admin')
    })
})

rotas.post('/categorias/editar',(req,res)=>{

    console.log(req.body.nome)
    modelCategoria.findOne({_id:req.body.id}).then((cat)=>{
        cat.nome=req.body.nome,
        cat.slug=req.body.slug

        cat.save().then(()=>{
            req.flash('success_msg','Categoria editada com sucesso')    
            res.redirect('/admin/categorias')
        }).catch((e)=>{
            req.flash('error_msg','Erro ao salvar categoria editada'+e) 
            res.redirect('/admin')
        })
    }).catch((e)=>{
        req.flash('error_msg','Erro categoria nao editada') 
        res.redirect('/admin')
        
    })
})

rotas.post('/categorias/excluir',(req,res)=>{
    modelCategoria.deleteOne({_id:req.body.id}).then(()=>{
        req.flash('success_msg','Categoria excluida com sucesso')    
        res.redirect('/admin/categorias')
    }).catch((e)=>{
        req.flash('error_msg','Erro ao apagar categoria') 
        res.redirect('/admin')
    })
})

//===============FIM CATEGORIAS=======================
rotas.get('/posts',(req,res)=>{
    res.send('pagina de posts')
})

module.exports=rotas