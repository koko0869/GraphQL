// GraphQL 실습4 (Koa + Graphql + mongodb)
// 참고 블로그 : https://velog.io/@kjs100184/MongoDB-GraphQL-2-CRUD-egjxluhdia

// > yarn add --dev nodemon
// > yarn add babel-cli babel-preset-env koa apollo-server-koa

import Koa from "koa";
import { ApolloServer, gql } from "apollo-server-koa";

//model
import User from "./models/User";

require("dotenv").config();
import mongoose from "mongoose";

//.env 값 비구조화 할당
const { PORT, MONGO_URI } = process.env;

// mongodb connect 및 연결체크
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log("Connect to MongoDB");
  })
  .catch(e => {
    console.log(e);
  });

//koa 객체생성
const app = new Koa();

//GraphQL 스키마 작성 (파일 모듈화 가능)
const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    age: Int!
    gender: String!
  }
  type Query {
    getUser(_id: ID!): User
    allUser: [User]
  }
  input UserInput {
    name: String!
    age: Int!
    gender: String!
  }

  type Mutation {
    createUser(input: UserInput): User
    updateUser(_id: ID!, input: UserInput): User
    deleteUser(_id: ID!): User
  }
`;

// GraphQL 리졸브 (파일 모듈화 가능)
const resolvers = {
  //Query는 조회 및 읽을 때 사용
  Query: {
    async getUser(root, { _id }) {
      return await User.findById(_id);
    },
    async allUser() {
      return await User.find();
    }
  },
  //Mutation는 수정 삭제 추가 때 사용
  Mutation: {
    async createUser(root, { input }) {
      return await User.create(input);
    },
    async updateUser(root, { _id, input }) {
      return await User.findOneAndUpdate({ _id }, input, { new: true });
    },
    async deleteUser(root, { _id }) {
      return await User.findOneAndDelete({ _id });
    }
  }
};

//  전체 유저확인
// query {
//   allUser {
//     name
//     age
//     gender
//   }
// }

// id 조회
// {
//   getUser(_id:"5e5f414267958a644679b502"){
//     _id
//     name
//     age
//     gender
//   }
// }

// 유저 추가
// mutation {
//   createUser(input: {
//     name: "김지훈"
//     age: 27
//     gender: "남자"
//   }){
//     name
//     age
//     gender
//   }
// }

// 유저 수정
// mutation {
//   updateUser(_id: "5e5f414267958a644679b502"
//   input: {
//     name: "임성환",
//     age: 22,
//     gender: "여자"
//   }
//   ){
//     name
//     age
//     gender
//   }
// }

// 유저 삭제
// mutation {
//   deleteUser(_id:"5e5f414267958a644679b502"){
//     name
//   }
// }
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`Koa 서버 http://localhost:4000${server.graphqlPath}`);
});

// GraphQL 실습3 (Koa)
// 참고 블로그 : https://m.blog.naver.com/psj9102/221397531137

// import Koa from "koa";
// import { ApolloServer, gql } from "apollo-server-koa";
// const { PORT, MONGO_URI } = process.env;
// onst app = new Koa();
// const Post = [
//   { _id: 1, title: "How to make Portal?", star: 6, author: "Benedict" },
//   { _id: 2, title: "I,m iron man", star: 8, author: "Iron" },
//   { _id: 3, title: "No.1 SuperHero", star: 4, author: "Super" },
//   { _id: 4, title: "Green man", star: 5, author: "Hurk" },
//   { _id: 5, title: "Super Power !!!", star: 6, author: "Hurk" },
//   { _id: 6, title: "I,m Kalel", star: 3, author: "Super" },
//   { _id: 7, title: "For A.I", star: 7, author: "Iron" },
//   { _id: 8, title: "New York Sanctum", star: 10, author: "Benedict" }
// ];

// const Author = [
//   { _id: 1, name: "Benedict", age: 52, location: "New York" },
//   { _id: 2, name: "Iron", age: 54, location: "Malibu" },
//   { _id: 3, name: "Super", age: 80, location: "Krypton" },
//   { _id: 4, name: "Hurk", age: 49, location: "New York" }
// ];

// const typeDefs = gql`
//   type Post {
//     _id: Int
//     title: String
//     star: Int
//     authorInfo: Author
//   }

//   type Author {
//     _id: Int
//     name: String
//     age: Int
//     location: String
//   }

//   type Query {
//     posts: [Post]
//     selectOne(name: String): Post
//   }
// `;

// const resolvers = {
//   Query: {
//     posts: () => Post,
//     selectOne: (root, { name }) =>
//       Post[Post.findIndex(({ author }) => name === author)]
//   },
//   Post: {
//     authorInfo: ({ author }) =>
//       Author[Author.findIndex(({ name }) => author === name)]
//   }
// };

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

// const server = new ApolloServer({ typeDefs, resolvers });

// server.applyMiddleware({ app });

// app.listen(PORT, () => {
//   console.log(`Koa 서버 http://localhost:4000${server.graphqlPath}`);
// });
