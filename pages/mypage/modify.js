import React, { Component } from 'react';
import styled from 'styled-components';
import _ from "lodash"
import { Form, Input, Select, Button, message } from 'antd';
import ModifyModal from "../../components/ModifyModal"
import AuthService from '../../utils/AuthService';
import UserService from '../../utils/UserService';
import withAuth from '../../utils/withAuth';

const { Option } = Select;

const Auth = new AuthService();
const User = new UserService();

const SingupWrapper = styled.div`
  margin: auto;
  width: 640px;
`;

class ModifyForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      confirmPwd: false,
      autoCompleteResult: [],
    };
  }

  static async getInitialProps(ctx) {
    const token = Auth.getToken(ctx.req);
    const userData = token ? await User.getUser(token) : null;
    return { user: userData ? userData.user : null };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { validateFields } = form;
    validateFields(async (err, values) => {
      if (err) {
        console.log('Received errors of form: ', err);
        return;
      } else {
        const cloneValues = { ...values };
        cloneValues.u_phone = cloneValues.u_phone + '';
        delete cloneValues.prefix;
        const token = await Auth.getToken();
        const res = await  User.putUser(token, cloneValues);
        if(res.success) {
          window.location.reload();
        } else {
          message.error('서버 요청에 실패했습니다. 다시 요청해주세요')
        }
      }
    });
  };

  handlePwdSubmit = e => {
    e.preventDefault();
    const { user } = this.props;
    const { form: modalForm } = this.formRef.props;
    modalForm.validateFields(async (err, values) => {
      if (err) {
        console.log('Received errors of form: ', err);
        return;
      } else {
        const res = await Auth.login(user.u_name, values.prevPwd);
        if(res) {
          this.toggleModal();
          this.props.form.setFieldsValue({
            u_password: values.password
          });
          modalForm.resetFields();
          this.setState({
            confirmPwd: true
          });
        } else {
          modalForm.setFields({
            prevPwd: {
              value: values.prevPwd,
              errors: [new Error('이전 비밀번호가 일치하지 않습니다.')],
            },
          });
        }
      }
    });
  };

  toggleModal = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen
    })
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { isOpen } = this.state;
    const { user, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 20,
          offset: 4,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '82',
    })(
      <Select style={{ width: 70 }}>
        <Option value="82">82</Option>
        <Option value="86">86</Option>
        <Option value="87">87</Option>
      </Select>,
    );

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <ModifyModal
          visible={isOpen}
          onOk={this.handlePwdSubmit}
          onCancel={this.toggleModal}
          wrappedComponentRef={this.saveFormRef}
        />
        {user && !_.isEmpty(user) && (
        <SingupWrapper>
          <Form.Item label="비밀번호">
            {getFieldDecorator('u_password', {
              rules: [
                {
                  required: true,
                  message: '비밀번호를 입력해주세요!',
                },
              ],
            })(<Input type="password" disabled />)}
            <Button onClick={this.toggleModal}>
              비밀번호 변경
            </Button>
          </Form.Item>
          <Form.Item label="이메일">
            {getFieldDecorator('u_email', {
              initialValue: user.u_email,
              rules: [
                {
                  type: 'email',
                  message: '이메일 형식이 올바르지 않습니다.',
                },
                {
                  required: true,
                  message: '이메일을 입력해주세요!',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="주소">
            {getFieldDecorator('u_address', {
              initialValue: user.u_address,
              rules: [
                {
                  required: true,
                  message: '주소를 입력해주세요!',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="전화번호">
            {getFieldDecorator('u_phone', {
              initialValue: user.u_phone,
              rules: [
                {
                  required: true,
                  message: '전화번호를 입력해주세요',
                },
              ],
            })(
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} />,
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              확인
            </Button>
          </Form.Item>
        </SingupWrapper>
        )}
      </Form>
    );
  }
}

const Modify = Form.create()(ModifyForm);

export default withAuth(Modify);
