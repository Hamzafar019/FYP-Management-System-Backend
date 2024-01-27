const jwt = require('jsonwebtoken');
const secretKey = process.env.YOUR_SECRET_KEY || "fyp_management_system";

const studentFYPregistrationauthentication=(req, res,next)=>{
    const token= req.header('authToken');

    // const authHeader = req.header('Authorization');

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   res.status(401).send({ error: "Please authenticate using a valid Bearer token" });
    //   return;
    // }
  
    // const token = authHeader.replace('Bearer ', '');
  
    
    if(!token){
        res.status(401).json({error:"Please authenticate using a valid token"})
        return
    }
    const data= jwt.verify(token, secretKey)
    if(data.role!=="student"){
        res.status(401).json({error:"You are not a student"})
        return
    }
    if(data.email!==req.body.student1&&data.email!==req.body.student2&&data.email!==req.body.student3){
        console.log(`${data.email}, ${req.body.student1}, ${req.body.student2}`)
        res.status(401).json({error:"You are not allowed to register for any other FYP group"})
        return
    }
    req.id=data.id
    req.name=data.name
    req.email=data.email
    req.role=data.role
    next()
}
module.exports=studentFYPregistrationauthentication