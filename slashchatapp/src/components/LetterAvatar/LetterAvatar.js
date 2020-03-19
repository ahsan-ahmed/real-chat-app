import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import deepPurple from "@material-ui/core/colors/deepPurple";
import "./index.css";

const styles = {
  purpleAvatar: {
    margin: 10,
    color: "#fff",
    backgroundColor: deepPurple[500]
  }
};

function LetterAvatar(props) {
  const {
    classes,
    loginUser: {
      isLoginUser: { img }
    }
  } = props;

  return img ? (
    <img src={img} alt="User Image" className="user-img" />
  ) : (
    <Avatar className={classes.purpleAvatar}>OP</Avatar>
  );
}

LetterAvatar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LetterAvatar);
