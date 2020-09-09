const localstrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

require('../models/Usuario')
const usuario = mongoose.model('usuario')

module.exports = function(passport){
//ele cria um passport e diz q vai se embasar por email
    passport.use(new localstrategy({usernameField:'email',passwordField:'senha'},(email,senha,done)=>{
        //procura um usuario com o email
        usuario.findOne({email:email}).then((usr)=>{
            //se nao achar retorna o done com os parametro CONTA AUTENTICADA, SUCESSO OUNAO,MENSAGEM
            if(!usr){
                return done(null,false,{message:"essa conta nao existe"})
            }
            //compara a senha doparamtro com a senha do usr
            bcrypt.compare(senha,usr.senha,(erro,sucesso)=>{
                if(sucesso){
                    return done(null,usr)
                }else{
                   return done(null,false,{message:"senha incorreta"})  
                }
            })
        })
    }))
}
//passar os dados do usr prauma sessao
passport.serializeUser((user,done)=>{
    done(null,user._id)
})

passport.deserializeUser((id,done)=>{
    usuario.findById(id,(err,usr)=>{
        done(err,usr)
    })
})