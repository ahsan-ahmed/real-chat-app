const INITIAL_STATE = {
  backUpUserRoom: {}
};

const BackUpUserRoomReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "BACKUP_USER_ROOM":
      console.log(action.payload);
      state = {
        ...state,
        backUpUserRoom: action.payload
      };
      break;
    default:
      return state;
  }
  return state;
};
export default BackUpUserRoomReducer;
