const {gql} = require('apollo-server');

const typeDefs = gql`

    #Query Defined fetched
    type Query{
        persons(view: viewPerson): dataPerson
        notifications: [Notification]
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

    #Entity
    type Notification{
        id: ID
        text: String
        link: String
        enable: Boolean
        fecha: String
    }

    #Entity virtual
    type Access{
        token: String
        active: Boolean!
    }

    ##Suscription 
    type Subscription{
        ##person
        #create new person
        notification: Notification!
    }

    ##Mutation for create or update
    type Mutation{
        ##person
        #create new person
        createPerson(person: newPerson!): createdPerson!
        #update person
        editPerson(person: editPerson!): editedPerson!
        #Delete person
        deletePerson(person: deletePerson!): deletedPerson!
        
        ##order
        #Create new order
        createOrder(order: newOrder!): createdOrder!

        ##notification
        #disabled notification
        disabledNotification(filter: disableNotification!): editedNotification!

        ##security
        #sign
        oAuth(credentials: credentials!): oAuth!
    }

    ###input's
    
    ##query
    input viewPerson{
        pageCurrent: Int
        sort: sorting 
        id: ID
        name: String
        age: Int
        active: Boolean
    }

    input sorting{
        type: sort! #default asc
        field: fieldPerson!
    }

    ##mutations

    #persons
    input newPerson{
        name: String!
        age: Int!
        active: Boolean!
    }

    input editPerson{
        id: ID!
        name: String!
        age: Int!
        active: Boolean!
    }

    input deletePerson{
        id:ID!
    }

    #orders
    input newOrder{
        type: summaryType!
        observation: String
        idPerson: ID!
    }

    #security
    input credentials{
        email: String!
        password: String!
    }

    #notifications
    input disableNotification{
        id: ID!
        type: typeNotification!
    }

    ##global response for Query
    type dataPerson{
        persons:[Person]
        count: Int
        pageCurrent: Int
        paginated:Boolean
    }

    ##global response for mutation
    #persons
    type createdPerson implements globalResponse{
        code: codeResponse!
        message: String!
        success: Boolean!
        person: Person
    }
    type editedPerson implements globalResponse{
        code: codeResponse!
        message: String!
        success: Boolean!
        person: Person
    }
    type deletedPerson implements globalResponse{
        code: codeResponse!
        message: String!
        success: Boolean!
    }
    #notifications
    type editedNotification implements globalResponse{
        code: codeResponse!
        message: String!
        success: Boolean!
        notification: Notification
    }
    #orders
    type createdOrder implements globalResponse{
        code: codeResponse!
        message: String!
        success: Boolean!
        order: Order
    }
    #security
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

   #enum for Mutation
   #->notification
   enum typeNotification{
       person
   }

   #enum for querys
   enum sort{
       ASC #asc order
       DESC #desc order
   }
   #->person
   enum fieldPerson{
       id
       name
       age
       active
   }
   #->orders
    enum summaryType{
        CANCELLED
        APPROVED
    }

   #enum for global response 
   enum codeResponse{
       CODE1000 #Person Created Sucecess
       CODE1001 #Person Updated success
       CODE1002 #Person missing with id parameters 
       CODE1003 #Person and his orders deleted succes

       CODE2000 #Order Created Success
       CODE2001 #person missing with idPerson paremeters

       CODE3000 #sign success
       CODE3001 #active is false, not access
       CODE3002 #email not exist
       CODE3003 #password not match hash

       CODE4000 #Disabled notification success
       CODE4001 #Notification not found

       CODE001X #Error internal
       CODE002X #Error parameters missing or invalid
       CODE003x #invalid access, need permision
    }
`;

module.exports = typeDefs;