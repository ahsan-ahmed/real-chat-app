import React from "react";
import socketIOClient from "socket.io-client";
import { Input, Form, Button } from "antd";
import { connect } from "react-redux";
import ImageAvatars from "../UserAvatar/UserAvatar";
import BackUpUserRoomAction from "../../Actions/backUpUserRoomAction/backUpUserRoomAction";
import Axios from "axios";
import * as subscription from "./../../subscription";

// https://slashchat.herokuapp.com/
const socket = socketIOClient("https://slashchat.herokuapp.com/");
const styles = {
  chatBodyMessagesContainer: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    height: "100%",
    overflow: "auto",
    paddingBottom: "50px"
  },
  chatBodyMessagesRight: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "flex-start"
  },
  chatBodyMessagesLeft: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  chatBodyMessagesAvatar: {},
  chatBodyMessagesBoxRight: {
    display: "flex",
    padding: 8,
    justifyContent: "flex-start",
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "#13c2c2"
  },
  chatBodyMessagesBoxLeft: {
    padding: 8,
    alignSelf: "center ",
    backgroundColor: "#e8e8e8",
    borderRadius: 20
  },
  chatBody: {
    height: "89%",
    position: "relative"
  },
  chatBodyFooter: {
    width: "100%",
    position: "absolute",
    bottom: 0
    // marginBottom: "2px"
  },
  msgUsernameBox: {
    display: "flex",
    flexDirection: "column",
    marginTop: -3
  },
  chatBodyFooterInput: {
    height: "36px",
    fontSize: "18px",
    fontWeight: "500"
  },
  chatBodyFooterButton: {
    height: "36px"
  },
  imageAvatar: {
    height: "40px",
    width: "40px",
    borderRadius: "50%",
    border: "none",
    margin: 10
  }
};

class ChatBox extends React.Component {
  state = {
    text: "",
    messageListNew: []
  };
  getOppUserTokenFromDatabase = async oppUserEmail => {
    let response = await fetch(
      `https://slashchat.herokuapp.com/getUserToken/${oppUserEmail}`
    );
    let json = await response.json();
    return json[0];
  };

  handleMessage = e => {
    e.preventDefault();
    const {
      IsUserLoginReducer: {
        isLoginUser: { username }
      },
      BackUpUserRoomReducer: {
        backUpUserRoom: {
          roomId,
          oppUserEmail,
          currentUserEmail,
          currentUsername,
          currentUserImg
        }
      }
    } = this.props;
    socket.emit("createMessage", {
      message: this.state.text,
      from: username
    });
    fetch(`https://slashchat.herokuapp.com/messages/${roomId}`, {
      method: "POST",
      body: JSON.stringify({
        roomId,
        messagesList: {
          message: this.state.text,
          from: username
        }
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        this.getOppUserTokenFromDatabase(oppUserEmail)
          .then(OppUserToken => {
            let { token } = OppUserToken;
            subscription.sendSubscription(token, {
              ...json,
              roomId,
              currentUserEmail,
              currentUsername,
              currentUserImg
            });
          })
          .catch(error => console.log(error));
      });
    this.setState({ text: "" });
  };

  handleTextChange = e => {
    this.setState({ text: e.target.value });
  };

  componentDidMount() {
    const { BackUpUserRoomReducer, IsUserLoginReducer } = this.props;
    if (IsUserLoginReducer.isLoginUser) {
      socket.emit("joinRoom", BackUpUserRoomReducer.backUpUserRoom.roomId);
    }
    socket.on("newMessage", msg => {
      this.setState(state => ({
        messageListNew: [
          ...state.messageListNew,
          { message: msg.text, from: msg.from }
        ]
      }));
    });
    if (IsUserLoginReducer.isLoginUser) {
      if (
        BackUpUserRoomReducer.backUpUserRoom.email ===
        IsUserLoginReducer.isLoginUser.email
      )
        Axios.get(
          "https://slashchat.herokuapp.com/messages/" +
            BackUpUserRoomReducer.backUpUserRoom.roomId
        )
          .then(res => {
            if (res.data.length) {
              this.setState({ messageListNew: [...res.data[0].messagesList] });
            } else {
              this.setState({ messageListNew: [] });
            }
          })
          .catch(err => {
            console.log(err);
          });
    }
    this.scrollToBottom();
  }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  componentDidUpdate(prevProps) {
    const {
      BackUpUserRoomAction,
      IsUserLoginReducer: {
        isLoginUser: { email }
      },
      getRoomInfo
    } = this.props;
    if (prevProps.getRoomInfo.roomId !== getRoomInfo.roomId) {
      socket.emit("joinRoom", getRoomInfo.roomId);
      BackUpUserRoomAction(getRoomInfo);
      Axios.get("https://slashchat.herokuapp.com/messages/" + getRoomInfo.roomId)
        .then(res => {
          if (res.data.length) {
            this.setState({ messageListNew: [...res.data[0].messagesList] });
          } else {
            this.setState({ messageListNew: [] });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
    this.scrollToBottom();
  }
  renderChatBox() {
    const {
      IsUserLoginReducer: {
        isLoginUser: { username, email }
      },
      getRoomInfo: {
        currentUserEmail,
        currentUsername,
        currentUserImg,
        oppUserEmail,
        oppUsername,
        oppUserImg
      }
    } = this.props;
    if (this.state.messageListNew.length) {
      return this.state.messageListNew.map((msg, i) => {
        const alignUser = msg.from === username;
        return (
          <div
            style={
              alignUser
                ? styles.chatBodyMessagesRight
                : styles.chatBodyMessagesLeft
            }
            key={msg + i}
          >
            <div style={styles.chatBodyMessagesAvatar}>
              <img
                src={msg.from === currentUsername ? currentUserImg : oppUserImg}
                alt={
                  msg.from === currentUsername ? currentUsername : oppUsername
                }
                style={styles.imageAvatar}
              />
            </div>
            <div style={styles.msgUsernameBox}>
              <div style={{ fontSize: 12, paddingLeft: 5 }}>{msg.from}</div>
              <div
                style={
                  alignUser
                    ? styles.chatBodyMessagesBoxRight
                    : styles.chatBodyMessagesBoxLeft
                }
              >
                {msg.message}
              </div>
            </div>
          </div>
        );
      });
    }
  }
  render() {
    return (
      <div style={styles.chatBody}>
        <div style={styles.chatBodyMessagesContainer}>
          {this.renderChatBox()}
          <div
            style={{ float: "left", clear: "both" }}
            ref={el => {
              this.messagesEnd = el;
            }}
          ></div>
        </div>
        <div style={styles.chatBodyFooter}>
          <Form onSubmit={this.handleMessage} style={{ display: "flex" }}>
            <Input
              placeholder="Enter a message..."
              style={styles.chatBodyFooterInput}
              onChange={this.handleTextChange}
              value={this.state.text}
              id="message"
            />
            <Button
              htmlType="submit"
              type="primary"
              style={styles.chatBodyFooterButton}
              disabled={!this.state.text}
            >
              Send..
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    IsUserLoginReducer: state.IsUserLoginReducer,
    GetMessagesListReducer: state.GetMessagesListReducer,
    BackUpUserRoomReducer: state.BackUpUserRoomReducer
  };
};

const mapDispatchToProps = dispatch => ({
  BackUpUserRoomAction: value => {
    dispatch(BackUpUserRoomAction(value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);
