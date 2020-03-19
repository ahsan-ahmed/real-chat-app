const INITIAL_STATE = {
  newGroupCreated: []
};

const NewGroupCreatedReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "NEW_GROUP_CREATED":
      state = {
        ...state,
        newGroupCreated: [...state.newGroupCreated, action.payload]
      };
      break;
    default:
      return state;
  }
  return state;
};
export default NewGroupCreatedReducer;
