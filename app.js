//iniciandomodulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const uriBanco = 'mongodb://localhost/dbblog';
const aplicacao = express()
const PORT = 3000
const admin = require('./routes/admin')
const post = require('./routes/postagem')
const users = require('./routes/usuarios')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
const Postagem = mongoose.model('postagem')
const passport = require('passport')
require('./config/auth')(passport)

//configuraçoes
    //session
    aplicacao.use(session({
        secret:"CHAveEXtreMMENte$EGUra&$&cretA",
        resave:true,
        saveUninitialized:true
    }))

    aplicacao.use(passport.initialize())
    aplicacao.use(passport.session())

    //flash
    aplicacao.use(flash())

    //middlewere
    aplicacao.use((req,res,next)=>{
        res.locals.success_msg=req.flash("success_msg")
        res.locals.error_msg=req.flash("error_msg")
        res.locals.error=req.flash("error")
        res.locals.user = req.user||null
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
    aplicacao.get('/',(req,res)=>{
        Postagem.find().populate('categoria').then((post)=>{
            res.render('index',{postagens:post.map(post => post.toJSON())})
        }).catch((e)=>{
            
        })
    })
    aplicacao.use('/usuarios',users)
    aplicacao.use('/postagem',post)
    aplicacao.use('/admin',admin)//todas as rotas desse grupo de rotas tem o seguinte prefixo

//outros
aplicacao.listen(PORT)