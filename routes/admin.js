const express = require('express')
const rotas = express.Router()

const mongoose = require('mongoose')//importa mongoose
require('../models/Categoria')//importa o model
const modelCategoria = mongoose.model('categoria')//importa schema
require('../models/Postagem')
const modelPostagem = mongoose.model('postagem')

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
        res.render('admin/addcategoria', {categoria:cat.toJSON()})
    }).catch((e)=>{
        req.flash('error_msg','Categoria nao encontrada'+e) 
        res.redirect('/admin')
    })
})

rotas.post('/categorias/editar',(req,res)=>{

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
//===============INICIO POSTS=========================
rotas.get('/postagens',(req,res)=>{
    modelPostagem.find().populate('categoria').then((posts)=>{
        res.render('admin/postagem', {postagens:posts.map(posts => posts.toJSON())})
    }).catch((e)=>{
        req.flash('error_msg','Erro ao carregar postagens') 
        res.redirect('/admin')
    })
    
})

rotas.get('/postagens/cadastrar', (req,res)=>{
    modelCategoria.find().then((c)=>{
        res.render('admin/addpostagem',{categorias:c.map(c => c.toJSON())})
    }).catch((e)=>{
        req.flash('error_msg','Erro ao carregar categorias') 
        res.redirect('/admin')
    })
    
})

rotas.post('/postagens/nova',(req,res)=>{

    let erros = []

    if(!req.body.titulo||req.body.titulo==undefined||req.body.titulo==null){
        erros.push({texto:"Digite o nome"})   
    }
    if(req.body.categoria==0){
        erros.push({texto:"Selecione uma categoria"})
    }

    if(erros.length>0){
        modelCategoria.find().then((c)=>{
            res.render('admin/addpostagem',{categorias:c.map(c => c.toJSON()),erros:erros})
            
        }).catch((e)=>{
            req.flash('error_msg','Erro ao carregar categorias') 
            res.redirect('/admin')
        })
    }else{
        const postagemNova = {
            titulo:req.body.titulo,
            slug:req.body.slug,
            descricao:req.body.descricao,
            conteudo:req.body.conteudo,
            categoria:req.body.categoria
        }

        new modelPostagem(postagemNova).save().then(()=>{
            req.flash('success_msg','Postagem criada com sucesso')    
            res.redirect('/admin/postagens')
        }).catch((e)=>{
            req.flash('error_msg','Erro interno ao cadastrar a postagem')    
            res.redirect('/admin/postagens')
        })
    }
    
})

rotas.get('/postagens/editar/:id',(req,res)=>{
    modelPostagem.findById(req.params.id).then((post)=>{
        modelCategoria.find().then((c)=>{
            res.render('admin/addpostagem',{
                postagem : post.toJSON(),
                categorias:c.map(c => c.toJSON())
            })
        }).catch((e)=>{
            req.flash('error_msg','Erro ao carregar categorias') 
            res.redirect('/admin')
        })
        
    }).catch((erro)=>{
        req.flash('error_msg','Erro interno ao carregar a postagem')    
        res.redirect('/admin/postagens')
    })
})

rotas.post('/postagens/editar',(req,res)=>{
    modelPostagem.findById(req.body.id).then((post)=>{
        post.titulo=req.body.titulo
        post.slug=req.body.slug
        post.descricao=req.body.descricao
        post.conteudo=req.body.conteudo
        post.categoria=req.body.categoria

        post.save().then(()=>{
            req.flash('success_msg','Postagem editada com sucesso')    
            res.redirect('/admin/postagens')
        }).catch((e)=>{
            req.flash('error_msg','Erro interno ao salvar ediçao da postagem')    
            res.redirect('/admin/postagens')
        })
    }).catch((e)=>{
        req.flash('error_msg','Erro ao salvar ediçao da postagem')    
        res.redirect('/admin/postagens')
    })
})

rotas.get('/postagens/excluir/:id',(req,res)=>{
    modelPostagem.findById(req.params.id).remove().then(()=>{
        req.flash('success_msg','Postagem excluida com sucesso')    
        res.redirect('/admin/postagens')
    }).catch((e)=>{
        req.flash('error_msg','Erro ao excluir a postagem')    
        res.redirect('/admin/postagens')
    })
})

//=================FIM POSTS===============================

module.exports=rotas