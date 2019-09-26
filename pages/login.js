import React, { Component } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Link from 'next/link';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import AuthService from '../utils/AuthService';
import withAuth from '../utils/withAuth';
import URL from "../constants/route-url"

const Auth = new AuthService();

const LoginWrapper = styled.div`
  margin: auto;
  width: 540px;
`;

export class LoginForm extends Component {
  handleSubmit = async e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        console.log('Received errors of form: ', err);
      } else {
        const { u_name, u_password } = values;
        const res = await Auth.login(u_name, u_password);
        console.log(res)
        if(res) {
          Router.push(URL.HOME.link);
        } else {

        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <LoginWrapper>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('u_name', {
              rules: [{ required: true, message: '아이디를 입력해주세요!' }],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="아이디"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('u_password', {
              rules: [{ required: true, message: '비밀번호를 입력해주세요!' }],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="비밀번호"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Link href="/password">
              <a className="Login-form-forgot" href="">
                비번 찾기
              </a>
            </Link>
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>아이디 저장</Checkbox>)}
            <Button block type="primary" htmlType="submit">
              로그인
            </Button>
          </Form.Item>
        </Form>
      </LoginWrapper>
    );
  }
}

const Login = Form.create()(LoginForm);

export default withAuth(Login);
