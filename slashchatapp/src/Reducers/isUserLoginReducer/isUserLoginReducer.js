const INITIAL_STATE = {
  isLoginUser: null,
  isSignUpClick: false
};
// SIGNUP_CLICK
const IsUserLoginReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      state = {
        ...state,
        isLoginUser: action.payload
      };
      break;
    case "SIGNUP_CLICK":
      state = {
        ...state,
        isSignUpClick: action.payload
      };
      break;
    default:
      return state;
  }
  return state;
};
export default IsUserLoginReducer;
