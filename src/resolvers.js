//data sources
var personDataSource = require('./dataSource/person');
var orderDataSource = require('./dataSource/order');
var accountDataSource = require('./dataSource/account');
var notificationDataSource = require('./dataSource/notification');

//helpers
const { authorize } = require('./helper/security');



//sucription
const {notificationType}  = require('./helper/schema/suscription');

const resolvers = {

//Querys
    Query:{
        //////////////
        //person source

        //find fetch
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
        },

        //////////////
        //notification source
        notifications: async(_,args,{user})=>{
            authorize(user,['admin','distributor']);
            return await notificationDataSource.getNotifications();
        }
    },
//Mutations
    Mutation:{
        /////////////
        //person Source
        createPerson: async(_,{person},{pubSub,user})=>{
            authorize(user,['admin','distributor']);
            const { name,age,active } = person;
            var createdPersonResult =  await personDataSource.createPreson(name,age,active);
            var feedNotification = await notificationDataSource.createNotification({text:"New Person: "+createdPersonResult.person.name,link:"/person/edit/"+createdPersonResult.person.id});
            pubSub.publish([notificationType()],{notification:feedNotification});
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
        //notification Source
        disabledNotification: async(_,{id},{user})=>{
            authorize(user,["admin","distributor"]);
            return await notificationDataSource.disabledNotification(id);
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
        notification:{
            subscribe: (_,__,{pubSub,user}) =>{
                authorize(user,['admin']);
                return pubSub.asyncIterator([notificationType()])
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