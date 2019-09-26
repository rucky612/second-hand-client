import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const ModifyForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends Component {
    compareToFirstPassword = (rule, value, cb) => {
      const { form } = this.props;
      if (value && value !== form.getFieldValue('password')) {
        cb('새 비밀번호가 일치하지 않습니다.');
      } else {
        cb();
      }
    };

    render() {
      const { visible, onCancel, onOk, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          title="비밀번호 변경"
          visible={visible}
          okText="확인"
          cancelText="취소"
          onOk={onOk}
          onCancel={onCancel}
        >
          <Form layout="vertical">
            <Form.Item label="이전 비밀번호">
              {getFieldDecorator('prevPwd', {
                rules: [
                  {
                    required: true,
                    message: '비밀번호를 입력해주세요',
                  },
                ],
              })(<Input type="password"/>)}
            </Form.Item>
            <Form.Item label="새 비밀번호">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '비밀번호를 입력해주세요',
                  },
                ],
              })(<Input type="password"/>)}
            </Form.Item>
            <Form.Item label="새 비밀번호 확인">
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: '비밀번호를 입력해주세요',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input type="password" />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

export default ModifyForm