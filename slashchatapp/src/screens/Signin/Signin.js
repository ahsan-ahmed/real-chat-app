import React from "react";
import { Form, Icon, Input, Button, Card } from "antd";
import "./Signin.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import IsUserLoginAction from "../../Actions/isUserLoginAction/isUserLoginAction";
import IsSignUpAction from "../../Actions/isSignUpAction/isSignUpAction";

const axios = require("axios");

class NormalLoginForm extends React.Component {
  state = {
    loginUser: null
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(typeof values.password);
        axios
          .get("https://slashchat.herokuapp.com/login/" + values.email)
          .then(res => {
            if (res.data) {
              if (
                res.data.email === values.email &&
                res.data.password === values.password
              ) {
                this.setState({
                  loginUser: { ...res.data }
                });
                this.props.IsUserLoginAction({ ...res.data });
                this.props.history.replace("/");
              } else {
                alert(
                  "No user acount with that email or probably you enter wrong password"
                );
              }
            } else {
              alert("No user acount with that email");
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  };
  componentDidMount() {
    const { IsUserLoginReducer } = this.props;
    if (IsUserLoginReducer.isLoginUser) {
      this.props.history.replace("/");
    } else if (
      IsUserLoginReducer.isSignUpClick &&
      !IsUserLoginReducer.isLoginUser
    ) {
      this.props.history.replace("/signup");
    }
  }
  handleSignUpClick = () => {
    this.props.IsSignUpAction(true);
  };
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="login-container">
        <Card hoverable style={{ width: 300 }}>
          <h1>Login Form</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
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
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              Or{" "}
              <Link onClick={this.handleSignUpClick} to="/signup">
                SignUp now !
              </Link>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}
const LoginForm = Form.create({ name: "normal_login" })(NormalLoginForm);

const mapStateToProps = state => {
  return { IsUserLoginReducer: state.IsUserLoginReducer };
};
const mapDispatchToProps = dispatch => ({
  IsUserLoginAction: value => {
    dispatch(IsUserLoginAction(value));
  },
  IsSignUpAction: value => {
    dispatch(IsSignUpAction(value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
