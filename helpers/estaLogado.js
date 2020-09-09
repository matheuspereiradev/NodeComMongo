module.exports={
    estaLogado:function(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }

        req.flash('error_msg','Faça login') 
        res.redirect('/') 
    }
}