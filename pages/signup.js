import React, { Component } from "react";
import Router from "next/router";
import axios from "axios";
import { Form, Input, Select, Checkbox, Button, message } from "antd";
import UserService from "../utils/UserService";
import { URL } from "../config.json";
import routeUrl from "../constants/route-url";

const { Option } = Select;

const User = new UserService();

class SignupForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false,
      autoCompleteResult: []
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        console.log("Received errors of form: ", err);
        return;
      } else {
        const cloneValues = { ...values };
        cloneValues.u_phone = cloneValues.u_phone + "";
        delete cloneValues.confirm;
        delete cloneValues.prefix;
        const user = await User.postUser(cloneValues);
        if (user.success) {
          Router.push(routeUrl.LOGIN.link);
        } else {
          console.log({ err });
          message.error(
            "서버와 통신이 끊겼습니다. 다시 시도해 주시길 바랍니다.",
            3
          );
        }
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, cb) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("u_password")) {
      cb("두 비밀번호가 일치하지 않습니다.");
    } else {
      cb();
    }
  };

  validateUserId = async (rule, value, cb) => {
    if (value) {
      try {
        const res = await axios.post(`${URL}/user/duplicate`, {
          u_name: value
        });
        res.data.length !== 0
          ? cb("아이디가 중복됩니다. 다른 아이디로 설정해주시길 바랍니다.")
          : cb();
      } catch (e) {
        console.log({ e });
        cb("서버가 응답할 수 없습니다. 잠시 뒤에 다시 해 주세요.");
      }
    } else {
      cb();
    }
  };

  validateToNextPassword = (rule, value, cb) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    cb();
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 20,
          offset: 4
        }
      }
    };
    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "82"
    })(
      <Select style={{ width: 70 }}>
        <Option value="82">82</Option>
        <Option value="86">86</Option>
        <Option value="87">87</Option>
      </Select>
    );

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <div style={{ margin: "auto", width: "640px" }}>
          <Form.Item label="아이디">
            {getFieldDecorator("u_name", {
              rules: [
                {
                  required: true,
                  message: "아이디를 적어주세요"
                },
                {
                  validator: this.validateUserId
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="비밀번호">
            {getFieldDecorator("u_password", {
              rules: [
                {
                  required: true,
                  message: "비밀번호를 형식에 맞게 올바르게 입력해주세요!"
                },
                {
                  validator: this.validateToNextPassword
                }
              ]
            })(<Input type="password" />)}
          </Form.Item>
          <Form.Item label="비밀번호 확인">
            {getFieldDecorator("confirm", {
              rules: [
                {
                  required: true,
                  message: "이메일이 일치하지 않습니다."
                },
                {
                  validator: this.compareToFirstPassword
                }
              ]
            })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
          <Form.Item label="이메일">
            {getFieldDecorator("u_email", {
              rules: [
                {
                  type: "email",
                  message: "이메일 형식이 올바르지 않습니다."
                },
                {
                  required: true,
                  message: "이메일을 입력해주세요!"
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="주소">
            {getFieldDecorator("u_address", {
              rules: [
                {
                  required: true,
                  message: "주소를 입력해주세요!"
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="전화번호">
            {getFieldDecorator("u_phone", {
              rules: [
                {
                  required: true,
                  message: "전화번호를 입력해주세요"
                }
              ]
            })(
              <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <p style={{ marginBottom: "0" }}>1. 그냥 동의한다. </p>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Checkbox>위 약관에 동의하시겠습니까?</Checkbox>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              확인
            </Button>
          </Form.Item>
        </div>
      </Form>
    );
  }
}

const Signup = Form.create()(SignupForm);

export default Signup;
