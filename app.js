//iniciandomodulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const uriBanco = 'mongodb://localhost/dbblog';
const aplicacao = express()
const PORT = 3000
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')

//configuraçoes
    //session
    aplicacao.use(session({
        secret:"CHAveEXtreMMENte$EGUra&$&cretA",
        resave:true,
        saveUninitialized:true
    }))

    //flash
    aplicacao.use(flash())

    //middlewere
    aplicacao.use((req,res,next)=>{
        res.locals.success_msg=req.flash("success_msg")
        res.locals.error_msg=req.flash("error_msg")
        next()//se nao passar ele trava
    })

    //bodyparser
    aplicacao.use(bodyparser.urlencoded({extended:true}))
    aplicacao.use(bodyparser.json())
    //handlebars
    aplicacao.engine('handlebars',handlebars({defaultlayout:'main'}))
    aplicacao.set('view engine','handlebars')
    //mongoose
    mongoose.Promise = global.Promise
    mongoose.connect(uriBanco,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log('conectado ao mongo')
    }).catch((e)=>{
        console.log('erro ao conectar ao mongo '+e)
    })
    //arquivo estatico
    aplicacao.use(express.static(path.join(__dirname,"public")))


//rotas
    aplicacao.use('/admin',admin)//todas as rotas desse grupo de rotas tem o seguinte prefixo

//outros
aplicacao.listen(PORT)