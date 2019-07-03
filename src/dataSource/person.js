//person datasource

//import helper class
const globalResponse = require('../helper/globalResponse');

//import models
const person = require("../database/models/person");

const personDataSource = {
    
    //reducer for mapping
    personReducer(person){
        const { id,name,age,active,order } = person;
        var JsonResponse = new personReducer(id,name,age,active,order);
        return JsonResponse;
    },

    //fetch all
    async getPeople () {
        try{
            var peoples = await person.fetchAll({withRelated:["order"]});
            return peoples.serialize()!=null ? peoples.serialize().map(person => this.personReducer(person)):[]; 
        }catch(error){
            console.log(error);
            throw error;
        }
    },
    //find by ID
    async getPerson(id){
        try{
            var personData = await person.where({id:id}).fetch({withRelated:["order"]});
            return personData!=null?this.personReducer(personData.serialize()):[];
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