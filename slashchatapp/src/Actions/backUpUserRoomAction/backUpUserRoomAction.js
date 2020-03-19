const BackUpUserRoomAction = value => {
  console.log(value, "value");
  return {
    type: "BACKUP_USER_ROOM",
    payload: value
  };
};
export default BackUpUserRoomAction;
