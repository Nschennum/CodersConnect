import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const SelectListGroup = ({
  name,
  value,
  error,
  info,
  onChange, 
  options
}) => {
  //options: map through obj arr name and value
  const selectOptions = options.map(option => (
    <option key={option.label} value={option.value}>
    {option.label}
    </option>
  ))
  return (
    <div class="form-group">
      <select
        className={classnames("form-control form-control-lg", {
          "is-invalid": error
        })}
        name={name}
        value={value}
        onChange={onChange}
      > 
      {selectOptions}
      </select>
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

SelectListGroup.propTypes = {
  name: PropTypes.string.isRequired,  
  value: PropTypes.string.isRequired, 
  info: PropTypes.string.isRequired,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired, 
  options: PropTypes.array.isRequired
 }


export default SelectListGroup;