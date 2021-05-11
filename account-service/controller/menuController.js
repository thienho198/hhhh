const Menu = require('../model/menu');
const codes = require('../../common/enum/codes');
const _ = require('lodash');

//create 
//* if dont have parentId => create root if not exist root otherwise create child of root
module.exports.create = async(req, res, next) => {
    try{
       if(req.body.parentId && req.body.parentPosition){
         const children = await Menu.find({parentId:req.body.parentId,position:new RegExp(`^${req.body.parentPosition}`)}).lean(); 
         if(children.length >0){
          const lastChildPosition = children.reduce((prev,current)=>{return Number(prev.position) > Number(current.position) ? prev.position : current.position})
          var newPosition = req.body.parentPosition + (Number (lastChildPosition.replace(req.body.parentPosition,'')) + 1).toString()
        } 
         else{
          var newPosition = req.body.parentPosition + '1'
         }
        
         req.body.position = newPosition;
       }
       else{
         const root = await Menu.findOne({isRoot: true}).lean();
         if(root){
          const children = await Menu.find({parentId:root._id.toString(),position:new RegExp(`^${root.position}`)}).lean(); 
          if(children.length >0){
           let lastChildPosition = children.reduce((prev,current)=>{return Number(prev.position) > Number(current.position) ? prev.position : current.position})
           typeof lastChildPosition === 'object' && (lastChildPosition = lastChildPosition.position)
           var newPosition = root.position + (Number (lastChildPosition.replace(root.position,'')) + 1).toString()
         } 
          else{
           var newPosition = root.position + '1'
          }
          req.body.parentId = root._id.toString();
          req.body.position = newPosition;
         }
         else{
          req.body.isRoot = true;
          req.body.position = '1';
          
         }
       }
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
      const {filter,sort,limit,skip,projection} = req.query;  
      let [result,count] = await Promise.all([
          Menu.find(filter,projection,{skip:skip,limit:limit,sort:sort}).populate('requiredTypes').lean(),
          Menu.countDocuments(filter)
      ])
      //filter array requiredTypes
      if(req.query.filter_array_regex_requiredTypes){
        const regex = new RegExp(req.query.filter_array_regex_requiredTypes,'i')
        result = result.filter(document=>{
            const matchIndex = document.requiredTypes.findIndex(item=>regex.test(item.name));
            if(matchIndex>=0) return true;
            else return false;
        })
      }
      const arrPositionRoot = [];
      if (Object.keys(filter).length>0 || req.query.filter_array_regex_requiredTypes){
          result = result.filter(i=>{
            return !(result.findIndex(k=>{
              return i.parentId == k._id.toString()
            })>=0);
          })
            
          const arrPromise = result.map(item =>{
            return new Promise((resolve, reject) =>{
              arrPositionRoot.push(item.position);
              const regex = `^${item.position}`
              Menu.find({position:new RegExp(regex)}).populate('requiredTypes').lean()
              .then(res=>{
                resolve(res);
              })
              .catch(err =>{
                console.log(err);
                reject(err);
              })
            })
          })
          const filteringArrResult = await Promise.all(arrPromise);
          const filteringArrResultFlat = filteringArrResult.reduce((prev,current)=>{return prev.concat(current)},[]) 
          filteringArrResultFlat.forEach(row=>{
            if(arrPositionRoot.indexOf(row.position)>=0){
              row.parentId = null;
            }
          })
          result = filteringArrResultFlat;
          count = result.length;
      }
      
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
    res.status(500).send({message:err.message});
  }
}

module.exports.delete = async(req, res, next)=>{
  try{
    const position = req.query.position;
    await Menu.deleteMany({position:new RegExp(`^${position}`)});
    res.send({...codes.SUCCESS[req.language]});
  }
  catch(err) {
    console.error(err);
    res.status(500).send({message:err.message})
  }
}