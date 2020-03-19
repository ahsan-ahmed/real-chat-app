import React from "react";
import { Form, Icon, Input, Button, Card } from "antd";
import "./Signup.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import IsSignUpAction from "../../Actions/isSignUpAction/isSignUpAction";
import UploadImage from "../../components/UploadImage";
const axios = require("axios");

class NormalSignupForm extends React.Component {
  state = {
    base64UserImage: null,
    imgError: ""
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err && this.state.base64UserImage) {
        axios
          .get("https://slashchat.herokuapp.com/signup/" + values.email)
          .then(res => {
            if (res.data.length) {
              alert("user exist");
            } else {
              axios
                .post("https://slashchat.herokuapp.com/signup", {
                  username: values.userName,
                  email: values.email,
                  password: values.password,
                  img: this.state.base64UserImage
                })
                .then(response => {
                  this.props.IsSignUpAction(false);
                  this.props.history.replace("/login");
                })
                .catch(error => {
                  console.log(error);
                });
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.setState({ imgError: "Please upload image" });
      }
    });
  };
  handleGoToSignUpClick = () => {
    this.props.IsSignUpAction(false);
  };
  componentDidMount() {
    const { IsUserLoginReducer, history } = this.props;

    if (!IsUserLoginReducer.isLoginUser && !IsUserLoginReducer.isSignUpClick) {
      history.replace("/login");
    } else if (IsUserLoginReducer.isLoginUser) {
      history.replace("/");
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { base64UserImage, imgError } = this.state;
    return (
      <div className="signup-container">
        <div className="signup-container-inner1">
          <div className="signup-container-inner1-div1" />
          <div className="signup-container-inner1-div2">
            <div>
              <Link onClick={this.handleGoToSignUpClick} to="/login">
                Go To Log In
              </Link>
            </div>
          </div>
        </div>
        <div className="signup-container-inner2">
          <Card hoverable style={{ width: 300 }}>
            <h1>SignUp Form</h1>
            <Form onSubmit={this.handleSubmit} className="signup-form">
              <Form.Item>
                {getFieldDecorator("userName", {
                  rules: [
                    { required: true, message: "Please input your username!" }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Username"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("email", {
                  rules: [
                    {
                      type: "email",
                      message: "The input is not valid E-mail!"
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!"
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon
                        type="mail"
                        theme="outlined"
                        style={{ color: "rgba(0,0,0,.25)" }}
                      />
                    }
                    placeholder="Email"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("password", {
                  rules: [
                    { required: true, message: "Please input your Password!" }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    type="password"
                    placeholder="Password"
                  />
                )}
              </Form.Item>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <UploadImage
                  base64UserImage={base64Url => {
                    this.setState({ base64UserImage: base64Url });
                  }}
                />
                {!base64UserImage && imgError && (
                  <p style={{ color: "red" }}>{imgError}</p>
                )}
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="signup-form-button"
                >
                  SignUp
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    );
  }
}

const SignupForm = Form.create({ name: "normal_signup" })(NormalSignupForm);
const mapStateToProps = state => {
  return { IsUserLoginReducer: state.IsUserLoginReducer };
};

const mapDispatchToProps = dispatch => ({
  IsSignUpAction: value => {
    dispatch(IsSignUpAction(value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
