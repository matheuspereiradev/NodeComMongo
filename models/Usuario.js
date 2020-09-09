const mongoose = require('mongoose')
const schema = mongoose.Schema;

const UsuarioSchema = new schema({
    nome:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    },
    senha:{
        type:String,
        required:true
    }
})

mongoose.model('usuario',UsuarioSchema)