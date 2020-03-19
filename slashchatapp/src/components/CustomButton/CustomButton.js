import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import red from "@material-ui/core/colors/red";

const styles = theme => ({
  margin: {
    margin: theme.spacing()
  },
  cssRoot: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700]
    }
  }
});

function CustomButton(props) {
  const { classes } = props;

  return (
    <Button
      variant="contained"
      color="primary"
      className={classNames(classes.margin, classes.cssRoot)}
      onClick={() => props.customButtonClick()}
      disabled={!props.buttonDisabling}
    >
      {props.buttonText}
    </Button>
  );
}

CustomButton.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(CustomButton);
