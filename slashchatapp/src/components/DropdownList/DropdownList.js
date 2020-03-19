import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";
import NewGroupsDialog from "../../screens/NewGroupsDialog/NewGroupsDialog";

const styles = {
  root: {
    flexGrow: 1,
    marginLeft: 150
  },
  menuDiv: {
    marginTop: 40,
    marginLeft: -5
  }
};

class DropdownList extends React.Component {
  state = {
    anchorEl: null
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleNewGroups = () => {
    console.log("handleNewGroups");
    this.clickChild();
  };

  handleSettings = () => {
    console.log("handleSettings");
  };

  handleCloseParentDropdownList() {
    this.setState({ anchorEl: null });
  }
  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <IconButton
          aria-owns={open ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <MoreIcon />
        </IconButton>
        <Menu
          className={classes.menuDiv}
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={open}
          onClose={this.handleClose}
        >
          <NewGroupsDialog
            setClick={click => (this.clickChild = click)}
            closeParentDropdownList={() => this.handleCloseParentDropdownList()}
          />
          <MenuItem onClick={this.handleNewGroups}>New Groups</MenuItem>
          <MenuItem onClick={this.handleSettings}>Settings</MenuItem>
        </Menu>
      </div>
    );
  }
}

DropdownList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DropdownList);
