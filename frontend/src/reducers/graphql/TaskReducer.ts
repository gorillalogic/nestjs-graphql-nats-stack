import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { gql } from "apollo-boost";
import { RootState } from "../../configureStore";
import graphqlClient from "../../lib/graphql/client";

export const fetchTasks = createAsyncThunk("tasks/fetch", async (_, { getState }) => {
  const { auth } = getState() as RootState;
  const response = await graphqlClient.query({
    query: gql`
      {
        tasks {
          id,
          contents,
          createdAt,
          updatedAt,
        }
      }
    `,
    context: {
      headers: {
        authorization: `Bearer ${auth.tokens?.access_token}`,
      },
    }
  })

})
