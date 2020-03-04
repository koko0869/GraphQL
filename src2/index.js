// GraphQL 실습3 (Koa)
// 참고 블로그 : https://m.blog.naver.com/psj9102/221397531137

// > yarn add --dev nodemon
// > yarn add babel-cli babel-preset-env koa apollo-server-koa 

import Koa from "koa";
import { ApolloServer, gql } from "apollo-server-koa";

const app = new Koa();

const Post = [
  { _id: 1, title: "How to make Portal?", star: 6, author: "Benedict" },
  { _id: 2, title: "I,m iron man", star: 8, author: "Iron" },
  { _id: 3, title: "No.1 SuperHero", star: 4, author: "Super" },
  { _id: 4, title: "Green man", star: 5, author: "Hurk" },
  { _id: 5, title: "Super Power !!!", star: 6, author: "Hurk" },
  { _id: 6, title: "I,m Kalel", star: 3, author: "Super" },
  { _id: 7, title: "For A.I", star: 7, author: "Iron" },
  { _id: 8, title: "New York Sanctum", star: 10, author: "Benedict" }
];

const Author = [
  { _id: 1, name: "Benedict", age: 52, location: "New York" },
  { _id: 2, name: "Iron", age: 54, location: "Malibu" },
  { _id: 3, name: "Super", age: 80, location: "Krypton" },
  { _id: 4, name: "Hurk", age: 49, location: "New York" }
];

const typeDefs = gql`
  type Post {
    _id: Int
    title: String
    star: Int
    authorInfo: Author
  }

  type Author {
    _id: Int
    name: String
    age: Int
    location: String
  }

  type Query {
    posts: [Post]
    selectOne(name: String): Post
  }
`;

const resolvers = {
  Query: {
    posts: () => Post,
    selectOne: (root, { name }) =>
      Post[Post.findIndex(({ author }) => name === author)]
  },
  Post: {
    authorInfo: ({ author }) =>
      Author[Author.findIndex(({ name }) => author === name)]
  }
};

// 실행.1 [배열]
//query {
//   posts{
//     title
//   }
// }

// 실행.2 [특정객체]
// query {
//   selectOne(name:"Hurk") {
//     title
//     star
//   }
// }

// 실행.3 [authorInfo 안값 조회가능]
// query {
//   posts {
//     title
//     authorInfo {
//       name
//       age
//       location
//     }
//   }
// }

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

const port = 4000;
app.listen(port, () => {
  console.log(`Koa 서버 http://localhost:${port}${server.graphqlPath}`);
});
