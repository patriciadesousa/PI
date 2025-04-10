import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";
import fs from "fs";
import csvParser from "csv-parser";

// Define GraphQL schema
//Similar to defining tables in sql
const typeDefs = gql`
  type User {
    user_id: ID!
    username: String!
    email: String!
    password: String!
    created_at: String!
  }

  type Workspace {
    workspace_id: ID!
    name: String!
    owner_id: Int!
    is_personal: Boolean!
    created_at: String!
  }

  type WorkspaceMember {
    workspace_id: Int!
    user_id: Int!
    role: String!
  }

  type Folder {
    folder_id: ID!
    name: String!
    workspace_id: Int!
    created_by: Int!
    created_at: String!
  }

  type Dashboard {
    dashboard_id: ID!
    name: String!
    folder_id: Int!
    workspace_id: Int!
    created_by: Int!
    created_at: String!
  }

  type Database {
    database_id: ID!
    name: String!
    type: String!
    workspace_id: Int!
    added_by: Int!
    connection_string: String!
    created_at: String!
  }

  type File {
    file_id: ID!
    filename: String!
    filepath: String!
    workspace_id: Int!
    uploaded_by: Int!
    uploaded_at: String!
  }

  type Question {
  question_id: ID!
  title: String!
  query_text: String!
  visualization_type: String!
  created_by: Int!
  workspace_id: Int!
  created_at: String!
}

type DashboardQuestion {
  dashboard_id: Int!
  question_id: Int!
  position: Int!
  size: String!
  created_at: String!
}

  type Query {
    getUsers: [User]
    getWorkspaces: [Workspace]
    getWorkspace_members: [WorkspaceMember]
    getFolders: [Folder]
    getDashboards: [Dashboard]
    getDatabases: [Database]
    getFiles: [File]
    getFileContent(file_id: Int!): [[String]]
    getQuestions: [Question]
    getDashboardQuestions: [DashboardQuestion]
  }
`;

//GetFiles: ()
const fileTable = [
  {
    file_id: 1,
    filename: "sales_data.csv",
    filepath: "./data/mock-storage/sales_data.csv",
    workspace_id: 1,
    uploaded_by: 1,
    uploaded_at: "2025-03-21 12:32:01"
  }
];

// Define mock resolvers
//Similar to populating the database in sql
const resolvers = {
  Query: {
    getUsers: () => [
      {
        user_id: 1,
        username: "john.doe",
        email: "john.doe@example.com",
        password: "12345678",
        created_at: "2025-03-21 12:32:01"
      }
    ],
    getWorkspaces: () => [
      {
        workspace_id: 1,
        name: "John's Personal Workspace",
        owner_id: 1,
        is_personal: true,
        created_at: "2025-03-21 12:32:01"
      },
      {
        workspace_id: 2,
        name: "Marketing Team",
        owner_id: 1,
        is_personal: false,
        created_at: "2025-03-21 12:32:01"
      }
    ],
    getWorkspace_members: () => [
      {
        workspace_id: 1,
        user_id: 1,
        role: "owner"
      },
      {
        workspace_id: 2,
        user_id: 1,
        role: "owner"
      }
    ],
    getFolders: () => [
      {
        folder_id: 1,
        name: "Q1 Reports",
        workspace_id: 1,
        created_by: 1,
        created_at: "2025-03-21 12:32:01"
      }
    ],
    getDashboards: () => [
      {
        dashboard_id: 1,
        name: "Sales Overview",
        folder_id: 1,
        workspace_id: 1,
        created_by: 1,
        created_at: "2025-03-21 12:32:01"
      }
    ],
    getDatabases: () => [
      {
        database_id: 1,
        name: "Corporate Orders DB",
        type: "mysql",
        workspace_id: 1,
        added_by: 1,
        connection_string: "mysql://example.com:3306/orders",
        created_at: "2025-03-21 12:32:01"
      }
    ],
    getFiles: () => fileTable,
    getFileContent: async (_parent, args) => {
      const file = fileTable.find(f => f.file_id === args.file_id);
      if (!file) return [];
  
      const results = [];
      const stream = fs.createReadStream(file.filepath).pipe(csvParser());
      for await (const row of stream) {
        results.push(Object.values(row));
      }

      return results;
    },

    getQuestions: () => [
      {
        question_id: 1,
        title: "Total Sales",
        query_text: "SELECT SUM(total) FROM sales_data",
        visualization_type: "bar",
        created_by: 1,
        workspace_id: 1,
        created_at: "2025-03-21 12:32:01"
      }
    ],
    
    getDashboardQuestions: () => [
      {
        dashboard_id: 1,
        question_id: 1,
        position: 1,
        size: "large",
        created_at: "2025-03-21 12:32:01"
      }
    ],
    
  }
};

// Create Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, { listen: { port: 4000 } }).then(({ url }) => {
  console.log(`🚀 Mock GraphQL API running at ${url}`);
});
