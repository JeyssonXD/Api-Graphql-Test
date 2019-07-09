//data sources
var personDataSource = require('./dataSource/person');
var orderDataSource = require('./dataSource/order');
var accountDataSource = require('./dataSource/account');

//helpers
const { authorize } = require('./helper/security');



//sucription
const {createdPerson}  = require('./helper/schema/suscription');

const resolvers = {

//Querys
    Query:{
        //////////////
        //person source

        //find by
        person: async(_,args,context)=>{
            authorize(context.user,['admin']);
            return await personDataSource.getPerson(args.id);
        },
        //find all advance
        persons: async(_,{view},context)=>{
            authorize(context.user,['admin']);
            return await personDataSource.getPersons(view);
        },

        /////////////
        //order source

        //find all
        orders: async(_,args,context)=>{
            authorize(context.user,['admin','distributor']);
            return await orderDataSource.getOrders();
        },
        //find by
        order: async(_,args,context)=>{
            authorize(context.user,['admin','distributor']);
            return await orderDataSource.getOrder(args.id);
        }
    },
//Mutations
    Mutation:{
        /////////////
        //person Source
        createPerson: async(_,{person},{pubSub,user})=>{
            authorize(user,['admin']);
            const { name,age,active } = person;
            var createdPersonResult =  await personDataSource.createPreson(name,age,active);
            pubSub.publish([createdPerson()],{createPerson:createdPersonResult});
            return createdPersonResult;
        },
        editPerson: async(_,{person},{user})=>{
            authorize(user,['admin']);
            const {id,name,age,active} = person;
            return await personDataSource.editPerson(id,name,age,active);
        },
        deletePerson:async(_,{person},{user})=>{
            authorize(user,['admin']);
            const {id} = person;
            return await personDataSource.deletePerson(id);
        },

        //////////////
        //order Source
        createOrder:async(_,{order},context) =>{
            authorize(context.user,['admin','distributor']);
            const { type,observation, idPerson } = order;
            return await orderDataSource.createOrder(type,observation,idPerson);
        },

        //////////////
        //security
        oAuth: async(_,{credentials},context,info) =>{
            //auth allow anonymous
            const { email,password } = credentials;
            return await accountDataSource.sign(email,password);
        }
    },
//Suscription
    Subscription:{
        //Person events
        createPerson:{
            subscribe: (_,__,{pubSub,user}) =>{
                authorize(user,['admin']);
                return pubSub.asyncIterator([createdPerson()])
            }
        }
    },
//interfaces
    globalResponse:{
        __resolveType(data, ctx, info) {
            return data;
        }
    }
}

module.exports = resolvers;