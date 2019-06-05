//security data source

//import helper class
var globalResponse = require("../helper/globalResponse");
const bcrypt = require("bcryptjs");

//import models
const user = require("../database/models/user");
//const role =  require("../database/models/role");

const accountDataSource = {
    //get token mutation
    sign: async(email,password)=>{
        try{
            
            let userBD = await user.where({email:email}).fetch({withRelated:'role'});
            //exist
            if(userBD==null) return globalResponse("CODE3002",false,"access denied, not user exist with the email sending",'access',{token:null,active:false});

            var userCache = userBD.serialize();
            //active
            if(userCache.active==false) return globalResponse("CODE3001",false,"access denied, active is false",'access',{token:null,active:false});

            //verify password
            if(!userBD.isValidPassword(password)) return globalResponse("CODE3003",false,"access denied, credentials invalid",'access',{token:null,active:false});

            return globalResponse("CODE3000",true,"granted access, credentials verified correctly","access",{token:userBD.auth(),active:true});
        }catch(error){
            console.log(error);
            throw error;
        }
    },
    //intental not global response
    getAccess: async(email)=>{
        try{
             var role = await user.where({email:email}).fetch({withRelated:'role'});
             return role.serialize().role;
        }catch(error){
            console.log(Error);
            throw  error;
        }
    }
}

module.exports = accountDataSource;