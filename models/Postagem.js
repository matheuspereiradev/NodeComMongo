const mongoose = require('mongoose')
const schema = mongoose.Schema

const PostagemSchema= new schema({
    titulo:{
        type:String,
        require:true
    },
    slug:{
        type:String,
        require:true
    },
    descricao:{
        type:String,
        require:true
    },
    conteudo:{
        type:String,
        require:true
    },
    data:{
        type:Date,
        default:Date.now()
    },
    categoria:{
        type:schema.Types.ObjectId,
        ref:'categoria',
        require:true
    }
})

mongoose.model('postagem',PostagemSchema)