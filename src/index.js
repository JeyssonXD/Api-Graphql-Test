const { ApolloServer,ApolloError,PubSub } = require('apollo-server');
const typeDefs = require('./schema');

//helpers
const { verifyEmail } = require('./helper/security');
const globalResponse = require('./helper/globalResponse');

//dataSources
const accountDataSource = require('./dataSource/account');

//resolvers
const resolvers = require('./resolvers');

//export context
const pubSub = new PubSub();

const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    engine:{
        apiKey: "<APOLLO ENGINE API KEY HERE>"
    },
    introspection: true,
    context: async({req,connection})=>{
        if(connection){
            return {
                ...connection.context,
                pubSub
            };
        }else{
            const token = req.headers.authorization;
            var verified =  verifyEmail(token);

            if(!verified.valid){  return {user:null,active:false,roles:null} }
            if(!verified.active){ return {user:verified.email,active:false,roles:null} }
            var roles = await accountDataSource.getAccess(verified.email);
            return {user:{email:verified.email,active:verified.valid,roles:roles},pubSub};
        }
    },
    subscriptions: {
        onConnect: async(connectionParams, webSocket, context) => {
            console.log("conected");
            const token = connectionParams.authorization;
            var verified =  verifyEmail(token);

            if(!verified.valid){  return {user:null,active:false,roles:null} }
            if(!verified.active){ return {user:verified.email,active:false,roles:null} }
            var roles = await accountDataSource.getAccess(verified.email);
            return {user:{email:verified.email,active:verified.valid,roles:roles},pubSub};
        },
        onDisconnect: (webSocket, context) => {
            console.log("disconect");
        },
      }
 });


server.listen().then(
    ({url})=>{
        console.log(`🚀 Server ready at ${url}`)
    }
);