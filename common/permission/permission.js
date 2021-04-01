var Promise = require('bluebird');
const Role = require('../../auth-service/model/role');
const AccessControl = require('accesscontrol');
const ac = new AccessControl();


function Permission(resource,action,options) {
    options = options || {};
    if(!resource){
        throw new Error('Missing resource [permission checking]')
    }
    if(!action){
        throw new Error('Missing action [permission checking]')
    }
    this.resource = resource;
    this.action = action;
}

Permission.prototype.handle = function(){
    return async(req, res, next)=>{
    
        const permissionByAction = (ac,role,resource,action, isOwn)=>{
            switch(action){
                case 'create': 
                    if(isOwn){
                        return ac.can(role).createOwn(resource).granted ? ac.can(role).createOwn(resource) : ac.can(role).createAny(resource);
                    }
                    return ac.can(role).createAny(resource);
                case 'read':
                    if(isOwn){
                        return ac.can(role).readOwn(resource).granted ? ac.can(role).readOwn(resource) : ac.can(role).readAny(resource);
                    }
                    return ac.can(role).readAny(resource);
                default:
                    throw new Error(`Invalid action ${action} [permission checking]`)
            }
        }
    
        try{
            const isOwn = await this.checkOwn();
            const user = req.token.user;
            if(user.type.roles.indexOf('super admin')>=0){
                req.filterAttributes = '*';
                next();
            }
            const roles = await Role.find().lean();
            ac.setGrants(roles);
            for(let i = 0; i < user.type.roles.length; i++){
                const permission = permissionByAction(ac,user.type.roles[i],this.resource,this.action, isOwn);
                if(permission.granted){
                    req.filterAttributes = permission.attributes;
                    next();
                    return;
                }
            }
            throw new Error('Access denied')
        }
        catch(err){
            console.log('[permission checking]',err);
            res.status(500).send({message:err.message})
        }
    
    }
} 

Permission.prototype.checkOwn = function(req) {
    return Promise.resolve(false)
}

module.exports = Permission;