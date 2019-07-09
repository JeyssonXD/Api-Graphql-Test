var validator  = require("validator");

//validator
 class person{
  
  constructor(id,name,age,active){
    this.id=id;
    this.name=name;
    this.age=age;
    this.active=active;
  }

  //is valid do search in high sorting
  isValid(){
    let flag  = false;
    
    if(validator.isNumeric(""+this.id)){
      flag=true;
    }

    if(validator.isAlpha(""+this.name) || validator.isNumeric(""+this.age) || validator.isBoolean(""+this.active)){
      flag=true;
    }

    return flag;
  }

} 

module.exports = person;