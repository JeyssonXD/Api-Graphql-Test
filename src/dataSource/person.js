//person datasource

//import helper class
const globalResponse = require('../helper/globalResponse');

//import validator
var personValidator = require('../helper/validators/personValidator');

//import models
const person = require("../database/models/person");

//size for page
let pageSize = 10;

const personDataSource = {
    
    //reducer for mapping
    personReducer(person){
        const { id,name,age,active,order } = person;
        var JsonResponse = new personReducer(id,name,age,active,order);
        return JsonResponse;
    },
    //high sorting
    async getPersons(view){
        try{
            //all data
            if(view==null){
                var peoples = await person.fetchAll({withRelated:["order"]});
                var count = await person.count('id');
                return {persons:peoples.serialize().map(person => this.personReducer(person)),count:count,paginated:false};
            }
            //high sorting
            else{

                if(view.pageCurrent==null){
                    view.pageCurrent= 1;
                }

                //set data
                var search = new personValidator(view.id,view.name,view.age,view.active);

                //context
                let QueriablePerson  = person;
                let countWhere  = {};

                QueriablePerson =  QueriablePerson.query((qb)=>{

                    //search
                    if(search.isValid()){
                        //identification
                        if(view.id!=null){
                           qb.where({id:view.id});
                           countWhere = {...countWhere,id:view.id};
                        }
                        //name
                        if(view.name!=null){
                            qb.where({name:view.name});
                            countWhere = {...countWhere,name:view.name};
                        }
                        //age
                        if(view.age!=null){
                            qb.where({age:view.age});
                            countWhere = {...countWhere,age:view.age};
                        }
                        //active
                        if(view.active!=null){
                            qb.where({active:view.active});
                            countWhere = {...countWhere,active:view.active};
                        }
                    }

                    //sort
                    if(view.sort){
                        qb.orderBy(view.sort.field,view.sort.type);
                    }
                    
                });
                
                var peoples = await QueriablePerson.fetchPage({page:view.pageCurrent,pageSize,withRelated:["order"]});

                var count = await person.where(countWhere).count('*');

                console.log(count);
                
                return { persons:peoples.serialize().map(person => this.personReducer(person)),count,pageCurrent:view.pageCurrent,paginated:true};
            }
        }catch(error){
            console.log(error);
            throw error;
        }
    },

    //created
    async createPreson(name,age,active){
        try{
            let newPerson = new person({
                name:name,
                age:age,
                active:active
            });
            var bdPerson = await newPerson.save(null,{method:'insert'});
            return bdPerson.serialize()!=null?globalResponse("CODE1000",true,"Person created correctly",'person',bdPerson.serialize()):globalResponse("CODE001X",false,"failed action",'person',null);
        }catch(error){
            console.log(error);
            throw error;
        }
    },

    //edited
    async editPerson(id,name,age,active){
        try{
            //validation person
            var bdPerson = await person.where({id:id}).fetch();
            if(bdPerson==null) return globalResponse("CODE1002",false,"id parameter it does not correspond to person");

            //map new data 
            bdPerson.set('name',name);
            bdPerson.set('age',age);
            bdPerson.set('active',active);

            var dataSaveChange = await bdPerson.save();
            return dataSaveChange.serialize()!=null?globalResponse("CODE1001",true,"Person edited correctly",'person',dataSaveChange.serialize()):globalResponse("CODE001X",false,"failed action update",'person',null);
        }catch(error){
            console.log(error);
            throw error;
        }
    },

    //deleted
    async deletePerson(id){
        try{
            //validation person
            var bdPerson = await person.where({id:id}).fetch({ withRelated: ['order'] });
            if(bdPerson==null) return globalResponse("CODE1002",false,"id parameter it does not correspond to person");

            //delete
            await bdPerson.destroy({cascade:true});

            return globalResponse("CODE1003",true,"Person and his orders deleted succes");
        }catch(error){
            console.log(error);
            throw error;
        }
    }

}//end dataSource

//class for reducer
class personReducer {
    constructor(id,name,age,active,order){
        this.id = id;
        this.name = name;
        this.age = age;
        this.active = active;
        this.order = order.map((iOrder)=> { return {id:iOrder.id,observation:iOrder.observation,type:iOrder.type,
            orderSummary({type}){
                switch(type){
                    case "APPROVED":
                        return "Yeah, you'r order has approved"
                        break; 
                    case "CANCELLED":
                        return "Not, you'r order not can approved";
                        break;
                    default: 
                    return "Not or definition enum type, please read documentation";
                    break;
                }
            }
        }});
    }
}


module.exports = personDataSource;