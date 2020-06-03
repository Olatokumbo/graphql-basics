import {GraphQLServer} from "graphql-yoga";

const data=[{
    id: "1",
    name: "Elizabeth King",
    email: "elizabethking@gmail.com"
},
{
    id: "2",
    name: "Esther King",
    email: "estherking@gmail.com"
},
{
    id: "3",
    name: "Victoria King",
    email: "victoriaking@gmail.com"
}]

const post = [
    {id: "post1", title: "Anchorman", body: "The anchorman movie", published: true, author: "1", comment: "comment1"},
    {id: "post2", title: "Iron Man", body: "It is about a multi-millionaire who developed a state of the art super suit", published: false, author: "2", comment: "comment2"},
    {id: "post3", title: "The Space between us", body: "A boy being born on Mars then decided to come to Earth who then falls in love", published: true, author: "3", comment: "comment3"},
]
const comment=[
    {id: "comment1", text: "Text1", author: "1", post: "post1"},
    {id: "comment2", text: "Text2", author: "2", post: "post2"},
    {id: "comment3", text: "Text3", author: "3", post: "post3"},
]


const typeDefs = `
    type Query{
        users: [User!]!
        posts(query: String): [Post!]!
        me: User!
        comments: [Comment!]!
    }
    type User{
        id: ID!,
        name: String!
        email: String!
        age: Int,
        posts: [Post!]
        comments: [Comment!]!
    }
    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comment: [Comment!]!
    }
    type Comment{
        id: ID!
        text: String!
        author: User!
        post: [Post!]!
    }
`

const resolvers={
    Query:{
        users(){
            return data
        },
        posts(parent, args, stx, info){
            if(!args.query){
                return post
            }
            return post.filter((data)=>{
                const titleMatch = data.title.toLowerCase().includes(args.query.toLowerCase())
                const bodyMatch = data.body.toLowerCase().includes(args.query.toLowerCase())
                return(titleMatch || bodyMatch)
            });
        },
        comments(){
            return comment
        },
        me(){
            return{
                id: "Me101",
                name: "David",
                email: "faithodesola@gmail.com",
                age: 20
            }
        }
    },
    Post:{
        author(parent, args, ctx, info){
            return data.find((test)=>{
                return test.id===parent.author
            });
        },
        comment(parent, args, ctx, info){
         
           return comment.filter((data)=>{
                return data.id === parent.comment
            })
        }
    },
    Comment:{
        author(parent, args, ctx, info){
                return data.find((data)=>{
                    return data.id===parent.author
                })
        },
        post(parent, args, ctx, info){
            return post.filter((data)=>{
                return data.comment===parent.id
            })
        }
    },

    User:{
        posts(parent, args, ctx, info){
            return post.filter((data)=>{
                return data.author===parent.id 
            })
        },
        comments(parent, args, ctx, info){
            return comment.filter((data)=>{
                return data.author===parent.id
            });
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=> console.log("Server has started"));