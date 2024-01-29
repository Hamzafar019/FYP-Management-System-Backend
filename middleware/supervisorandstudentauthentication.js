const jwt = require('jsonwebtoken');
const secretKey = process.env.YOUR_SECRET_KEY || "fyp_management_system";

const supervisorauthentication=async (req, res,next)=>{
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
    if(data.role!=="supervisor" && data.role!=="student"){
        res.status(401).send({error:"You are not a supervisor or a student"})
        return
    }
    if(data.role==="student"){

        try {
            const response2 = await fetch('http://localhost:3001/FYPregistration/status', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'authToken': `${token}`,
                
              },
            });
    
            if (!response2.ok) {
              // Handle non-2xx responses
              const errorData = await response.json();
              return;
    
            }
            const data2 = await response2.json();
            
            req.groupid=data2[0].id


          } catch (error) {
            console.log("Error finding Group")
          }

        
        next()
    }
    if(data.role==="supervisor"){
        
    req.email=data.email;
    next()
    }
}
module.exports=supervisorauthentication