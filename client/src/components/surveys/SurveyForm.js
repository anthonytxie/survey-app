import React, { Component } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
// Field component can be radio box, form fields, anything!!!
import { reduxForm, Field } from 'redux-form';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails.js';
import formFields from './formFields';

class SurveyForm extends Component {
  // make a function that passes a component into a fields
  // then the field can get passed props.input... these are functions
  // that can be added to each field input tag

  renderFields() {
    return formFields.map(x => {
      return (
        <Field
          type="text"
          component={SurveyField}
          label={x.label}
          name={x.name}
          key={x.name}
        />
      );
    });
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
        {this.renderFields()}
        <Link to="/surveys" className="red btn-flat white-text">
					Cancel
        </Link>
        <button type="submit" className="teal btn btn-flat right white-text">
					Next
          <i className="material-icons right"> done</i>
        </button>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};

  errors.recipients = validateEmails(values.recipients || '');

  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = `You must provide a value`;
    }
  });

  return errors;
};

export default reduxForm({
  validate: validate,
  form: 'surveyForm',
  destroyOnUnmount: false,
})(SurveyForm);

//destoryOnUnmount makes values disspear or not on unmount
