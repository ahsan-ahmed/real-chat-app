import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing()
  }
});

function handleDelete() {
  alert("You clicked the delete icon.");
}

// function handleClick() {
//   alert('You clicked the Chip.'); // eslint-disable-line no-alert
// }

function UserChips(props) {
  const { classes } = props;
  return (
    <span className={classes.root}>
      {props.selectedUserList.map((val, i) => (
        <Chip
          key={val.username + i}
          avatar={
            <Avatar
              alt="Natacha"
              src="https://www.w3schools.com/w3images/avatar2.png"
            />
          }
          label={val.username}
          onDelete={handleDelete}
          className={classes.chip}
        />
      ))}
    </span>
  );
}

UserChips.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserChips);
