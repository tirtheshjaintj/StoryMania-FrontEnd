import { createSlice} from "@reduxjs/toolkit";

const initialState= null;

// Create the user slice with reducers
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser:(state, action) => {
      return action.payload;
    },
    removeUser: () => {
      return null; // Return null to reset the state
    },
  },
});

// Export the actions
export const { addUser, removeUser } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
