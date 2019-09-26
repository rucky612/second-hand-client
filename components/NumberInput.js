import React, { Component } from 'react';
import { Input, Button, Icon } from 'antd';

export default class NumberInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '',
    };
  }

  addNumber = () => {
    const { number } = this.state;
    const addNum = number + 1;
    this.props.onChange(addNum);
    this.setState({
      number: addNum,
    });
  };

  minusNumber = () => {
    const { number } = this.state;
    if (number - 1 > 0) {
      const minusNum = number - 1;
      this.props.onChange(minusNum);
      this.setState({
        number: minusNum,
      });
    }
  };

  PlusBtn = () => (
    <Icon style={{ cursor: 'pointer' }} type="plus" onClick={this.addNumber} />
  );

  MinusBtn = () => (
    <Icon
      style={{ cursor: 'pointer' }}
      type="minus"
      onClick={this.minusNumber}
    />
  );

  onChange = e => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      const num = value ? Number(value) : 1;
      this.props.onChange(num);
      this.setState({
        number: num,
      });
    }
  };

  render() {
    const { placeholder, ...rest } = this.props;
    const { number } = this.state;
    return (
      <Input
        {...rest}
        value={number}
        addonBefore={this.MinusBtn()}
        addonAfter={this.PlusBtn()}
        onChange={this.onChange}
        placeholder={placeholder}
        maxLength={25}
      />
    );
  }
}
