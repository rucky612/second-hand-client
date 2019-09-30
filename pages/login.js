import React, { Component } from "react";
import Router from "next/router";
import { Form, Icon, Input, Button, message } from "antd";
import AuthService from "../utils/AuthService";
import URL from "../constants/route-url";

const Auth = new AuthService();

export class LoginForm extends Component {
  handleSubmit = async e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        console.log("Received errors of form: ", err);
      } else {
        const { u_name, u_password } = values;
        const res = await Auth.login(u_name, u_password);
        if (res) {
          Router.push(URL.HOME.link);
        } else {
          message.error("아이디 또는 비밀번호를 확인해주세요");
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ margin: "auto", width: "540px" }}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator("u_name", {
              rules: [{ required: true, message: "아이디를 입력해주세요!" }]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="아이디"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("u_password", {
              rules: [{ required: true, message: "비밀번호를 입력해주세요!" }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="비밀번호"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              로그인
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const Login = Form.create()(LoginForm);

export default Login;
