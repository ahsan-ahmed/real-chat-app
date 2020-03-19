import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import { connect } from "react-redux";
import Axios from "axios";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("https://slashchat.herokuapp.com/");
const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  menuItem: {
    "&:focus": {
      backgroundColor: "#d9d9d9",
      "& $primary, & $icon": {
        color: theme.palette.common.white
      }
    }
  },
  primary: {},
  textParent: {
    marginLeft: "8px"
  },
  icon: {
    height: "50px",
    width: "50px",
    borderRadius: "50%",
    border: "none"
  }
});

let defaultImage =
  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTMgNTMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUzIDUzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBzdHlsZT0iZmlsbDojRTdFQ0VEOyIgZD0iTTE4LjYxMyw0MS41NTJsLTcuOTA3LDQuMzEzYy0wLjQ2NCwwLjI1My0wLjg4MSwwLjU2NC0xLjI2OSwwLjkwM0MxNC4wNDcsNTAuNjU1LDE5Ljk5OCw1MywyNi41LDUzDQoJYzYuNDU0LDAsMTIuMzY3LTIuMzEsMTYuOTY0LTYuMTQ0Yy0wLjQyNC0wLjM1OC0wLjg4NC0wLjY4LTEuMzk0LTAuOTM0bC04LjQ2Ny00LjIzM2MtMS4wOTQtMC41NDctMS43ODUtMS42NjUtMS43ODUtMi44ODh2LTMuMzIyDQoJYzAuMjM4LTAuMjcxLDAuNTEtMC42MTksMC44MDEtMS4wM2MxLjE1NC0xLjYzLDIuMDI3LTMuNDIzLDIuNjMyLTUuMzA0YzEuMDg2LTAuMzM1LDEuODg2LTEuMzM4LDEuODg2LTIuNTN2LTMuNTQ2DQoJYzAtMC43OC0wLjM0Ny0xLjQ3Ny0wLjg4Ni0xLjk2NXYtNS4xMjZjMCwwLDEuMDUzLTcuOTc3LTkuNzUtNy45NzdzLTkuNzUsNy45NzctOS43NSw3Ljk3N3Y1LjEyNg0KCWMtMC41NCwwLjQ4OC0wLjg4NiwxLjE4NS0wLjg4NiwxLjk2NXYzLjU0NmMwLDAuOTM0LDAuNDkxLDEuNzU2LDEuMjI2LDIuMjMxYzAuODg2LDMuODU3LDMuMjA2LDYuNjMzLDMuMjA2LDYuNjMzdjMuMjQNCglDMjAuMjk2LDM5Ljg5OSwxOS42NSw0MC45ODYsMTguNjEzLDQxLjU1MnoiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiM1NTYwODA7IiBkPSJNMjYuOTUzLDAuMDA0QzEyLjMyLTAuMjQ2LDAuMjU0LDExLjQxNCwwLjAwNCwyNi4wNDdDLTAuMTM4LDM0LjM0NCwzLjU2LDQxLjgwMSw5LjQ0OCw0Ni43Ng0KCQljMC4zODUtMC4zMzYsMC43OTgtMC42NDQsMS4yNTctMC44OTRsNy45MDctNC4zMTNjMS4wMzctMC41NjYsMS42ODMtMS42NTMsMS42ODMtMi44MzV2LTMuMjRjMCwwLTIuMzIxLTIuNzc2LTMuMjA2LTYuNjMzDQoJCWMtMC43MzQtMC40NzUtMS4yMjYtMS4yOTYtMS4yMjYtMi4yMzF2LTMuNTQ2YzAtMC43OCwwLjM0Ny0xLjQ3NywwLjg4Ni0xLjk2NXYtNS4xMjZjMCwwLTEuMDUzLTcuOTc3LDkuNzUtNy45NzcNCgkJczkuNzUsNy45NzcsOS43NSw3Ljk3N3Y1LjEyNmMwLjU0LDAuNDg4LDAuODg2LDEuMTg1LDAuODg2LDEuOTY1djMuNTQ2YzAsMS4xOTItMC44LDIuMTk1LTEuODg2LDIuNTMNCgkJYy0wLjYwNSwxLjg4MS0xLjQ3OCwzLjY3NC0yLjYzMiw1LjMwNGMtMC4yOTEsMC40MTEtMC41NjMsMC43NTktMC44MDEsMS4wM1YzOC44YzAsMS4yMjMsMC42OTEsMi4zNDIsMS43ODUsMi44ODhsOC40NjcsNC4yMzMNCgkJYzAuNTA4LDAuMjU0LDAuOTY3LDAuNTc1LDEuMzksMC45MzJjNS43MS00Ljc2Miw5LjM5OS0xMS44ODIsOS41MzYtMTkuOUM1My4yNDYsMTIuMzIsNDEuNTg3LDAuMjU0LDI2Ljk1MywwLjAwNHoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K";
class ChatDivider extends React.Component {
  state = {
    chatUsers: [],
    roomId: null
  };

  handleCreateRoom(OppUser) {
    this.props.targetedUser(OppUser);
    if (OppUser.group) {
      this.setState({ roomId: OppUser.roomId });
      this.props.getRoomId({
        roomId: OppUser.roomId,
        groupName: OppUser.groupName
      });
    } else {
      Axios.get("https://slashchat.herokuapp.com/rooms")
        .then(res => {
          !res.data.length
            ? this.postNewRoom(OppUser)
            : this.comparingUsers(OppUser, res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  postNewRoom = OppUser => {
    const {
      IsUserLoginReducer: {
        isLoginUser: { email, username, img }
      }
    } = this.props;
    const roomId = Math.random()
      .toString()
      .substring(2, 14);
    const userRoom = {
      roomId,
      currentUserEmail: email,
      currentUsername: username,
      currentUserImg: img || defaultImage,
      oppUserEmail: OppUser.email,
      oppUsername: OppUser.username,
      oppUserImg: OppUser.img || defaultImage,
      timestamp: new Date()
    };
    // roomIdRandom: roomIdRandom,
    // OppUserEmail: OppUser.email,
    // userName: OppUser.username,
    // OppUserImg: OppUser.img
    this.setState({ roomId }, () => {
      this.props.getRoomId({ ...userRoom });
    });
    Axios.post("https://slashchat.herokuapp.com/rooms", {
      userRoom
    })
      .then(res => {})
      .catch(err => {
        console.log(err);
      });
  };

  comparingUsers = (OppUser, res) => {
    let flag = false;
    const {
      IsUserLoginReducer: {
        isLoginUser: { email, username, img }
      }
    } = this.props;
    const prevData = res.data;

    prevData.forEach(val => {
      if (
        (OppUser.email === val.oppUserEmail ||
          OppUser.email === val.currentUserEmail) &&
        (email === val.currentUserEmail || email === val.oppUserEmail)
      ) {
        this.setState({ roomId: val.roomId }, () => {
          this.props.getRoomId({
            roomId: val.roomId,
            currentUserEmail: email,
            currentUsername: username,
            currentUserImg: img || defaultImage,
            oppUserEmail: OppUser.email,
            oppUsername: OppUser.username,
            oppUserImg: OppUser.img || defaultImage
          });
        });
        flag = true;
      }
    });
    if (!flag) {
      this.postNewRoom(OppUser);
    }
  };

  componentDidMount() {
    const { IsUserLoginReducer, BackUpUserRoomReducer } = this.props;
    socket.on("newGroupCreatedMessage", groupMsg => {
      groupMsg.msg.userGroup.forEach(element => {
        if (IsUserLoginReducer.isLoginUser.email === element.email) {
          this.setState(state => ({
            chatUsers: [...state.chatUsers, groupMsg.msg]
          }));
        }
      });
    });
    if (BackUpUserRoomReducer) {
      this.setState({ roomId: BackUpUserRoomReducer.backUpUserRoom.roomId });
    }
    Axios.get("https://slashchat.herokuapp.com/chatusers")
      .then(res => {
        this.setState({ chatUsers: [...res.data] }, () => {
          Axios.get("https://slashchat.herokuapp.com/groupRooms")
            .then(res => {
              let linkingGroups = [];
              res.data.forEach(val =>
                val.userGroup.forEach(users => {
                  if (users._id === IsUserLoginReducer.isLoginUser._id) {
                    linkingGroups.push(val);
                  }
                })
              );
              this.setState(state => ({
                chatUsers: [...state.chatUsers, ...linkingGroups]
              }));
            })
            .catch(e => {
              console.log(e);
            });
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { classes, IsUserLoginReducer, BackUpUserRoomReducer } = this.props;
    const { chatUsers } = this.state;

    const OpsUsers = chatUsers.filter(val => {
      return val._id !== IsUserLoginReducer.isLoginUser._id;
    });
    OpsUsers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    let name = [];
    return (
      <div className="chat-divider-parent">
        {OpsUsers.map(user => {
          name = [];
          return (
            <List key={user._id}>
              {!user.group ? (
                <ListItem
                  button
                  className={classes.root}
                  onClick={() => this.handleCreateRoom(user)}
                  selected={
                    user.email === BackUpUserRoomReducer.backUpUserRoom.OppUser
                  }
                >
                  <ListItemIcon>
                    <img
                      alt={user.username}
                      src={user.img}
                      className={classes.icon}
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.textParent}
                    primary={user.username}
                    secondary={user.timestamp || "timestamp"}
                  />
                </ListItem>
              ) : (
                <ListItem
                  button
                  className={classes.root}
                  onClick={() => this.handleCreateRoom(user)}
                  selected={user.roomId === this.state.roomId}
                >
                  {user.userGroup.forEach(msg => {
                    name.push(msg.username);
                  })}
                  <ListItemIcon>
                    <Avatar
                      alt="Remy Sharp"
                      src="https://spirecapital.com/wp-content/uploads/2016/09/user_group-512.png"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={user.groupName}
                    secondary={
                      name.length === 2
                        ? "You," + name[0]
                        : "You," +
                            name[0] +
                            " & " +
                            (name.length - 2) +
                            " others" || "timestamp"
                    }
                  />
                </ListItem>
              )}
              <Divider />
            </List>
          );
        })}
      </div>
    );
  }
}

ChatDivider.propTypes = {
  classes: PropTypes.object.isRequired
};

const hof = withStyles(styles)(ChatDivider);

const mapStateToProps = state => {
  return {
    IsUserLoginReducer: state.IsUserLoginReducer,
    BackUpUserRoomReducer: state.BackUpUserRoomReducer
  };
};
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(hof);
