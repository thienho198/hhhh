const Menu = require('../model/menu');
const codes = require('../../common/enum/codes');
const _ = require('lodash');

module.exports.create = async(req, res, next) => {
    try{
       const result = await Menu.create(req.body);
       res.send({...codes.SUCCESS[req.language], data:result});
    }
    catch(err){
        console.error(err);
        res.status(500).send({message:err.message})
    }
}

module.exports.read = async(req, res, next)=>{
    try{
      const {query,sort,limit,skip,projection} = req.query;  
      let [result,count] = await Promise.all([
          Menu.find(query,projection,{skip:skip,limit:limit,sort:sort}).populate('requiredTypes', 'name').lean(),
          Menu.estimatedDocumentCount(query)
      ])
      
      if(_.get(req,'token.user.type.name') === 'Super Admin'){
        res.send({...codes.SUCCESS[req.language], data:result, count:count})
      }
      else{
        const filterByType = result.map(menuItem=>{
            const requiredTypes = menuItem.requiredTypes;
            return requiredTypes.some(type=>type.name === _.get(req,'token.user.type.name'))
        })
        const countByType = filterByType.length;
        res.send({...codes.SUCCESS[req.language],data:filterByType, count:countByType})
      }

      
    }
    catch(err){
        console.error(err);
        res.status(500).send({message:err.message})
    }
}

module.exports.update = async(req, res, next)=>{
  try{
    const id = req.body.id;
    const updateResult = await Menu.findByIdAndUpdate(id, req.body,{new:true});
    res.send({...codes.SUCCESS[req.language],data:updateResult})
  }
  catch(err) {
    console.error(err);
    res.status(500).send({message:err.message})
  }
}