const express = require('express')
const rotas = express.Router()

const bcrypt = require('bcryptjs')

const mongoose = require('mongoose')//importa mongoose
require('../models/Usuario')//importa o model
const modelUsr = mongoose.model('usuario')//importa schema

rotas.get('/cadastrar', (req,res)=>{
    res.render('usuario/cadastro')
})

rotas.post('/salvarcadastro',(req,res)=>{
    
    const erros=[]
    if(req.body.senha!=req.body.senha2){
        erros.push({texto:'senhas nao coincidem'})
    }
   

    if(erros.length>0){
        res.render('usuario/cadastro',{erros:erros}) 
    }else{
        modelUsr.findOne({email:req.body.email}).then((usuario)=>{
            if(!usuario){
                const novoUsuario = new modelUsr({
                    nome:req.body.nome,
                    email:req.body.email,
                    senha:req.body.senha
                })

                bcrypt.genSalt(10,(erro,salt)=>{
                    bcrypt.hash(novoUsuario.senha,salt, (erro,hash) =>{
                        if(erro){
                            req.flash('error_msg','Erro') 
                            res.render('usuario/cadastro') 
                        }else{
                            novoUsuario.senha=hash
                            novoUsuario.save().then(()=>{
                                console.log('aqui')
                                req.flash('success_msg','Cadastrado com sucesso') 
                                console.log('redirect')
                                res.redirect('/') 
                            }).catch((e)=>{
                                req.flash('error_msg','Erro ao salvar') 
                                res.render('usuario/cadastro') 
                            })
                        }
                    })
                })

            }else{
                req.flash('error_msg','Email ja cadastrado') 
                res.redirect('/usuarios/cadastrar') 
            }

        }).catch((e)=>{
            req.flash('error_msg','Erro interno') 
            res.render('usuario/cadastro') 
        })
    }


})

module.exports=rotas