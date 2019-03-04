const Validator = require('validator'); 
const isEmpty =  require('./is-empty');

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.institution = !isEmpty(data.institution) ? data.institution : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if(Validator.isEmpty(data.institution)){
    errors.institution = 'Institution is required.';
  }
  if(Validator.isEmpty(data.degree)){
    errors.degree = 'Degree name is required.';
  }
  if(Validator.isEmpty(data.fieldofstudy)){
    errors.fieldofstudy = 'Field Of Study field is required.';
  }
  if(Validator.isEmpty(data.from)){
    errors.from = 'From date field is required.';
  }
  return {
    errors, 
    isValid: isEmpty(errors)
  }
}