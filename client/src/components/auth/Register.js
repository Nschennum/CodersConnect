import React, { Component } from "react";
import PropTypes from 'prop-types'; 
import { withRouter } from 'react-router-dom';  
import { connect } from 'react-redux'; 
import { registerUser } from '../../actions/authActions';
import TextFieldGroup from "../../common/TextFieldGroup";
import { Button } from 'reactstrap';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };

  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({errors: nextProps.errors })
    }
  }

onChange = (e) => {
  this.setState({[e.target.name]: e.target.value })
}

onSubmit = (e) => {
  e.preventDefault();

  const newUser = {
    name: this.state.name,
    email: this.state.email,
    password: this.state.password, 
    password2: this.state.password2
  }

  this.props.registerUser(newUser, this.props.history); 


}
  render() {

    const { errors } = this.state; //aka const errors = this.state.errors 

    const { user } = this.props.auth

    return (
      <div className="register">
      {user ? user.name : null }
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your CodersConnect account
              </p>
              <form onSubmit={this.onSubmit} className="mb-4">
              <TextFieldGroup
                  placeholder="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />
                <TextFieldGroup
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
                />
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <TextFieldGroup
                  placeholder="Confirm Password"
                  name="password2"
                  type="password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />
                <Button type="submit" className="btn-block mt-4" color="secondary">Submit</Button> 
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


//Mapping proptypes is good practice
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired, 
  errors: PropTypes.object.isRequired
}

const mSTP = (state) => ({
  auth: state.auth, //must match rootReducer in reducer index
  errors: state.errors //= this.props.errors
})

export default connect(mSTP, { registerUser })(withRouter(Register));
