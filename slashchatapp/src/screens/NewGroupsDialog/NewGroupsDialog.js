import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Axios from "axios";
import { connect } from "react-redux";
import AccountCircle from "@material-ui/icons/AccountCircle";
import UserChips from "../../components/UserChips/UserChips";
// import ArrowBack from "../../assets/baseline_arrow_back.png";
import Checkbox from "@material-ui/core/Checkbox";
import CustomButton from "../../components/CustomButton/CustomButton";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("https://slashchat.herokuapp.com/");
const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  appBar: {
    position: "relative"
  },
  flex: {
    marginLeft: 18
  },
  closeStyle: {
    marginLeft: -20
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 200
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class NewGroupsDialog extends React.Component {
  state = {
    open: false,
    chatUsers: [],
    selectedChats: [],
    groupName: ""
  };
  handleChangeInputText = event => {
    this.setState({ groupName: event.target.value });
  };
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.closeParentDropdownList();
  };

  handleCreateGroup = () => {
    const { IsUserLoginReducer } = this.props;
    if (!this.state.selectedChats.length) {
      alert("atleast one user add");
    } else {
      const roomIdRandom = Math.random()
        .toString()
        .substring(2, 14);
      const userGroupRoom = {
        roomIdRandom,
        groupName: this.state.groupName,
        group: true,
        userGroup: [
          ...this.state.selectedChats,
          IsUserLoginReducer.isLoginUser
        ],
        timestamp: new Date().toLocaleString()
      };
      Axios.post("https://slashchat.herokuapp.com/groupRooms", {
        userGroupRoom: userGroupRoom
      })
        .then(res => {
          this.setState({ open: false });
          this.props.closeParentDropdownList();

          socket.emit("newGroupCreated", userGroupRoom);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  componentDidMount() {
    const { IsUserLoginReducer } = this.props;

    this.props.setClick(this.handleClickOpen);
    Axios.get("https://slashchat.herokuapp.com/chatusers")
      .then(res => {
        let list = res.data.filter(
          val => val._id !== IsUserLoginReducer.isLoginUser._id
        );
        this.setState({ chatUsers: [...list] });
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleChange = (name, e) => event => {
    this.setState({ [name]: event.target.checked });
    if (event.target.checked) {
      this.setState(state => ({
        selectedChats: [...state.selectedChats, e]
      }));
    } else {
      const SplitUser = this.state.selectedChats.filter(
        split => split._id !== e._id
      );
      this.setState({
        selectedChats: [...SplitUser]
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { chatUsers } = this.state;

    return (
      <div>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                className={classes.closeStyle}
                color="inherit"
                onClick={this.handleClose}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                New Groups
              </Typography>
            </Toolbar>
          </AppBar>
          <div>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="standard-name"
                label="Group Name"
                style={{ width: "100%", marginLeft: 40, marginRight: 40 }}
                className={classes.textField}
                onChange={this.handleChangeInputText}
                margin="normal"
              />
            </form>
          </div>
          <div>
            <UserChips selectedUserList={this.state.selectedChats} />
          </div>
          <Divider />
          <List>
            {chatUsers.map((val, i) => (
              <div>
                <ListItem key={val.username + i}>
                  <ListItemIcon>
                    {<AccountCircle style={{ height: 35, width: 35 }} />}
                  </ListItemIcon>
                  <ListItemText primary={val.username} secondary={val.email} />
                  <Checkbox
                    onChange={this.handleChange(val.username, val)}
                    color="primary"
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
          <Paper
            className={classes.root}
            elevation={14}
            style={{
              position: "fixed",
              bottom: 0,
              width: "100%",
              display: "flex",
              justifyContent: "center"
            }}
          >
            <CustomButton
              customButtonClick={this.handleCreateGroup}
              buttonText={"Create Group"}
              buttonDisabling={
                this.state.groupName && this.state.selectedChats.length
              }
            />
          </Paper>
        </Dialog>
      </div>
    );
  }
}

NewGroupsDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

const hoc = withStyles(styles)(NewGroupsDialog);
const mapStateToProps = state => {
  return {
    IsUserLoginReducer: state.IsUserLoginReducer,
    BackUpUserRoomReducer: state.BackUpUserRoomReducer
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(hoc);
