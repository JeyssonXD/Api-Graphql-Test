//order datasource

//import helper class
var globalResponse = require("../helper/globalResponse");

//import models
const order = require('../database/models/order');
const person = require('../database/models/person');

const orderDatasource = {
    //reducer for mapping
    orderReducer(order){
        return {
            id: order.id,
            observation:order.observation,
            type:order.type,
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
            },
            person:{
                id: order.person.id,
                name: order.person.name,
                age: order.person.age,
                active: order.person.active
            }
        }
    },
    //get all
    async getOrders(){
        try{
            var orders = await order.fetchAll({withRelated:["person"]});
            return orders.serialize()!=null?orders.serialize().map(order=>this.orderReducer(order)):[];
        }catch(error){
            console.log(error);
            throw error;
        }
    },
    //find by ID
    async getOrder(id){
        try{
            var orderData = await order.where({id:id}).fetch({withRelated:["person"]});
            return orderData!=null?this.orderReducer(orderData.serialize()):[];
        }catch(error){
            console.log(error);
            throw error;
        }
    },
    //created
    async createOrder(type,observation,idPerson){
        try{
            let newOrder = new order({
                type:type,
                observation:observation,
                idPerson:idPerson
            });
            
            //validation attributes
            if (!newOrder.typeIsValid()) return globalResponse("CODE002X",false,"parameter 'type' not match schema enum for order",'order',null);

            //validation person
            var personBD = await person.where({id:idPerson}).fetch();
            if(personBD==null) return globalResponse("CODE2001",false,"idPerson invalid",'order',null);

            var bdOrder = await newOrder.save();
            var orderData = await order.where({id:bdOrder.serialize().id}).fetch({withRelated:["person"]});
            return orderData.serialize()!=null?globalResponse("CODE2000",true,"order created correctly", 'order', this.orderReducer(orderData.serialize())):globalResponse("CODE001X",false,'order',null);
        }catch(Error){
            console.log(Error);
            throw Error;
        }
    }
}

module.exports = orderDatasource;