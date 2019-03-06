import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { loginUser } from "../../actions/authActions";
// import TextFieldGroup from "../common/TextFieldGroup";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { errors } = this.state;
    return (
      <div class="login">
        <div class="container">
          <div class="row">
            <div class="col-md-8 m-auto">
              <h1 class="display-4 text-center">Log In</h1>
              <p class="lead text-center">
                Sign in to your DevConnector account
              </p>
              <form action="dashboard.html">
                <div class="form-group">
                  <input
                    type="email"
                    className={classnames('form-control form-control-lg', {'is-invalid': errors.email})}
                    placeholder="Email Address"
                    name="email"
                  />{errors.email && (<div className='invalid-feedback'>{errors.email}</div>)}
                </div>
                <div class="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control-lg', {'is-invalid': errors.password})}
                    placeholder="Password"
                    name="password"
                  />{errors.password && (<div className='invalid-feedback'>{errors.password}</div>)}
                </div>
                <input type="submit" class="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mSTP = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mSTP,
  { loginUser }
)(Login);
