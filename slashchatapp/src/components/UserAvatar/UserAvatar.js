import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles({
  avatar: { margin: 10 }
});

export default function ImageAvatars() {
  const classes = useStyles();

  return (
    <Avatar
      alt="Remy Sharp"
      src="https://www.w3schools.com/w3images/avatar2.png"
      className={classes.avatar}
    />
  );
}
