const All_fyps = require(`../models/all_fyps.js`);
const Rejected_projects = require(`../models/rejected_projects.js`);
const Temp = require(`../models/temp.js`);


const uniquetitle=async (req, res,next)=>{
    const title=req.body.title

    const all_fyps = await All_fyps.findAll({
        where:{
            title:title
        }
    });
      if (all_fyps.length > 0) {
        return res.status(404).json({ error: 'Project with this title is already present. Kindly check "View All FYPs" for registered FYPs' });
      }


      const temp_fyps = await Temp.findAll({
        where:{
            title:title
        }
    });
      if (temp_fyps.length > 0) {
        return res.status(404).json({ error: 'Project with this title is already registered by someone.' });
      }



      const rejected_projects = await Rejected_projects.findAll({
        where:{
            title:title
        }
    });
      if (rejected_projects.length > 0) {
        return res.status(404).json({ error: 'Project with this title is rejected. Kindly check "Rejected FYPs" for rejected projects list' });
      }
      
      
next()
    
    
}
module.exports=uniquetitle