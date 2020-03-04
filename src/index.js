//GraphQL 배열데이터 실습2

const { GraphQLServer } = require("graphql-yoga");

// 1
const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!        
  }

  type Mutation {                                    
    post(url: String!, description: String!): Link!  
  }   

  type Link {             
    id: ID!               
    description: String!  
    url: String!          
 }                        
`;

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
    }
  }
  //   Link: {
  //     id: parent => parent.id,
  //     description: parent => parent.description,
  //     url: parent => parent.url
  //   }
};
const server = new GraphQLServer({
  typeDefs,
  resolvers
});
server.start(() => console.log(`http://localhost:4000에서 서버 가동중`));

//데이터 확인해보기
//playGround

//  실행1
// mutation {
// post(
//     url: "www.prisma.io"
//     description: "Prisma replaces traditional ORMs"
//   ) {
//     id
//   }
// }

// 실행2
// query {
//     feed {
//       id
//       url
//       description
//     }
//   }
