const {gql} = require('apollo-server');

const typeDefs = gql`

    #Query Defined fetched
    type Query{
        people: [Person]
        person(id: ID!): Person
        orders: [Order]
        order(id: ID!): Order
    }

    #Entity
    type Person{
        id: ID
        name: String
        age: Int
        active: Boolean
        order: [Order]
    }
    
    #Entity
    type Order{
        id: ID
        observation: String
        type: String
        orderSummary(type: summaryType): String
        person: Person
    }

    #Entity virtual
    type Access{
        token: String
        active: Boolean!
    }

    #enum summaryType
    enum summaryType{
        CANCELLED
        APPROVED
    }

    ##Suscription 
    type Subscription{
        ##person
        #create new person
        createPerson: createdPerson!
    }

    ##Mutation for create or update
    type Mutation{
        ##person
        #create new person
        createPerson(person: newPerson!): createdPerson!
        
        ##order
        #Create new order
        createOrder(order: newOrder): createdOrder!

        ##security
        #sign
        oAuth(credentials: credentials): oAuth!
    }

    #input's
    input newPerson{
        name: String!
        age: Int!
        active: Boolean!
    }

    input newOrder{
        type: summaryType!
        observation: String
        idPerson: ID!
    }

    input credentials{
        email: String!
        password: String!
    }

    #global response for mutation
    type createdPerson implements globalResponse{
        code: codeResponse!
        message: String!
        success: Boolean!
        person: Person
    }
    type createdOrder implements globalResponse{
        code: codeResponse!
        message: String!
        success: Boolean!
        order: Order
    }

    type oAuth implements globalResponse{
        code: codeResponse!
        message: String!
        success: Boolean!
        access: Access!
    }

   #helper return format
   interface globalResponse{
       code: codeResponse!
       message: String!
       success: Boolean!
   }

   #enum for global response 
   enum codeResponse{
       CODE1000 #Person Created Sucecess

       CODE2000 #Order Created Success
       CODE2001 #person missing with idPerson paremeters

       CODE3000 #sign success
       CODE3001 #active is false, not access
       CODE3002 #email not exist
       CODE3003 #password not match hash

       CODE001X #Error internal
       CODE002X #Error parameters missing or invalid
       CODE003x #invalid access, need permision
    }
`;

module.exports = typeDefs;