const jwt = require('jsonwebtoken');
const secretKey = process.env.YOUR_SECRET_KEY || "fyp_management_system";

const supervisorauthentication=(req, res,next)=>{
    const token= req.header('authToken');

    // const authHeader = req.header('Authorization');

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   res.status(401).send({ error: "Please authenticate using a valid Bearer token" });
    //   return;
    // }
  
    // const token = authHeader.replace('Bearer ', '');
  
    
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"})
        return
    }
    const data= jwt.verify(token, secretKey)
    if(data.role!=="supervisor"){
        res.status(401).send({error:"You are not a supervisor"})
        return
    }
    req.id=data.id
    req.name=data.name
    req.email=data.email
    req.role=data.role
    next()
}
module.exports=supervisorauthentication