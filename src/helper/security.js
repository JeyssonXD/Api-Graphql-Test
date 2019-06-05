var jwt = require('jsonwebtoken');
//keys
require('dotenv').config();

//apollo-error
const {  AuthenticationError,ApolloError } = require("apollo-server");

module.exports = {
    /** 
        get email for token oAuth and verify token active
    **/ 
    verifyEmail: function(token){  
        return jwt.verify(token,process.env.JWT_SECRETKEY, (err,decoded)=>{
          if(err){
            //console.log(err);
            return  { valid:false,email: email,active:active };
          }
          var email = decoded.email;
          var active = decoded.active;
          return { valid:!!decoded,email: email,active:active };
        });
    },
    authorize:  (user,roles)=>{
      //not exist user
      if(user==null)
      {
        throw new AuthenticationError('not authorized, token invalid or undefined');
      }

      if(roles==null){
        throw new AuthenticationError('not authorized, not contains roles');
      }

      var flagAuth = false;
      roles.forEach(role => {
        user.roles.forEach(userRole=>{
          if(userRole.name==role){
            flagAuth = true;
          }
        });
      });

      if (!flagAuth) throw new AuthenticationError('not authorized, not contains enough permits')
    }
}