import React, { Component } from 'react';
import '../App.css';
import { Form, Input, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

export default class FormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      districtName: this.props.dName,
      error: '',
      array: ['1', '2', '3', '4'],
      bgColor: '',
      color: '',
    };
  }

  validated = (districtName, color) => {
    if (districtName === '' || color === '') {
      return false
    } else {
      return true
    }
  }

  handleSubmit = (event) => {
    console.log(...this.state.array);
    event.preventDefault();
    const { districtName, color, error } = this.state;
    this.validated(districtName, color) ? this.setState({ error: '' }) : this.setState({ error: 'Error: Fields can\'t be empty' })

    this.setState({
      districtName: '',
      bgColor: this.state.color,
      color: '',
    });
    return error;
  }

  handleInputChange = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const { districtName, bgColor, color, error } = this.state;

    return (
      <div style={{ backgroundColor: bgColor }} className="FormSpace">
        <h4>Current District : {districtName}</h4>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <p style={{ color: 'red' }} key={error}>{error}</p>
          <FormItem>
            <Input type='text' placeholder='District Name' name='districtName' value={districtName} onChange={this.handleInputChange} />
            <Input type='text' placeholder='Background Color' name='color' value={color} onChange={this.handleInputChange} />
          </FormItem>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form >
      </div>

    );
  }
}

