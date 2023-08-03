const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

const verifyToken = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(401).json({message: 'Acesso Negado!'})
    }

    const token = getToken(req)

    if(!token){
        return res.status(401).json({message: 'Acesso Negado!'})
    }

    try{
        const verified = jwt.verify(token, 'nossosecret')
        req.user=verified
        next()
    }catch{
        return res.status(401).json({message: 'Acesso Negado!'})
    }

}

module.exports = verifyToken