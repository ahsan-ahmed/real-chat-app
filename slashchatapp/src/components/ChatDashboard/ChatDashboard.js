import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import LetterAvatar from "../LetterAvatar/LetterAvatar";
import ChatDivider from "../ChatDivider/ChatDivider";
import { connect } from "react-redux";
import CustomButton from "../CustomButton/CustomButton";
import IsUserLoginAction from "../../Actions/isUserLoginAction/isUserLoginAction";
import ChatBox from "../ChatBox/ChatBox";
import DropdownList from "../DropdownList/DropdownList";
//import Axios from "axios";
import "./index.scss";
// import socketIOClient from "socket.io-client";
import * as subscription from "../../subscription";
// https://slashchat.herokuapp.com.//
const drawerWidth = 300;
// const socket = socketIOClient("https://slashchat.herokuapp.com/");
const styles = theme => ({
  root: {
    display: "flex",
    height: "100%"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginLeft: -15,
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1
  },
  avatarText: {
    marginLeft: 8
  },
  avatar: {},
  LogoutButton: {
    position: "fixed",
    right: 10
  }
});

class ChatDashboard extends React.Component {
  state = {
    mobileOpen: false,
    getRoomInfo: {},
    loginUser: null
    // roomId: null,
    // OppUser: null,
    // userName: null,
    // groupName: null
  };
  handleLogoutUser = () => {
    subscription.saveTokenOnDatabase(this.props.IsUserLoginReducer, null);
    this.props.IsUserLoginAction(null);
    this.props.history.push("/login");
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleGetRoomId = roomInfo => {
    // roomId: obj.roomIdRandom,
    // OppUser: obj.OppUser,
    // userName: obj.userName,
    // groupName: obj.groupName
    this.setState({ getRoomInfo: { ...roomInfo } });
  };
  getTargeteduser = val => {
    this.setState({ targetedUser: val });
  };
  componentDidMount() {
    const { IsUserLoginReducer, history } = this.props;
    if (!IsUserLoginReducer.isLoginUser) {
      history.replace("/login");
    } else {
      subscription.subscribeUser(IsUserLoginReducer);
      this.setState({ loginUser: IsUserLoginReducer.isLoginUser.username });
    }
  }

  render() {
    const {
      classes,
      theme,
      BackUpUserRoomReducer,
      IsUserLoginReducer
    } = this.props;
    const { targetedUser } = this.state;

    const drawer = (
      <div>
        <ListItem className="list-parent" key={"text"}>
          <ListItemIcon className={classes.avatar}>
            <LetterAvatar loginUser={IsUserLoginReducer} />
          </ListItemIcon>
          <ListItemText
            className={classes.avatarText}
            primary={this.state.loginUser}
          />
          <DropdownList />
        </ListItem>
        <Divider />
        <ChatDivider
          history={this.props.history}
          getRoomId={this.handleGetRoomId}
          targetedUser={this.getTargeteduser}
        />
      </div>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              {targetedUser
                ? targetedUser.group
                  ? targetedUser.groupName
                  : targetedUser.username
                : BackUpUserRoomReducer.backUpUserRoom.groupName ||
                  BackUpUserRoomReducer.backUpUserRoom.userName ||
                  "Chat App"}
            </Typography>
            <Typography className={classes.LogoutButton}>
              <CustomButton
                history={this.props.history}
                customButtonClick={this.handleLogoutUser}
                buttonText={"Logout"}
                buttonDisabling={"1"}
              />
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          <Hidden smUp implementation="css">
            <Drawer
              container={this.props.container}
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div style={{ marginBottom: 10 }} className={classes.toolbar} />
          <ChatBox
            getRoomInfo={this.state.getRoomInfo}
            // roomId: this.state.roomId,
            //   OppUser: this.state.OppUser,
            //   userName: this.state.userName,
            //   groupName: this.state.groupName
          />
        </main>
      </div>
    );
  }
}
ChatDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  container: PropTypes.object,
  theme: PropTypes.object.isRequired
};
const ChatDrawerComp = withStyles(styles, { withTheme: true })(ChatDashboard);
const mapStateToProps = state => {
  return {
    IsUserLoginReducer: state.IsUserLoginReducer,
    BackUpUserRoomReducer: state.BackUpUserRoomReducer
  };
};
const mapDispatchToProps = dispatch => ({
  IsUserLoginAction: value => {
    dispatch(IsUserLoginAction(value));
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(ChatDrawerComp);
