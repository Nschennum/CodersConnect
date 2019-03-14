import React, { Component } from 'react'; 
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'; 
import { connect } from 'react-redux'; 
import { getCurrentProfile, deleteAccount } from '../actions/profileActions'; 
import Spinner from '../common/Spinner'; 
import ProfileActions from './ProfileActions';
import Experience from './Experience';
import Education from './Education';
import '../App.css'

class Dashboard extends Component {
  componentDidMount(){
    this.props.getCurrentProfile();
  }

onDeleteClick(e) {
  this.props.deleteAccount(); 
}

  render() {
    const { user } = this.props.auth; 
    const { profile, loading } =this.props.profile;

    let dashboardContent; 

    if(profile === null || loading) {
      dashboardContent = < Spinner />;
    } else {
      //check if logged in user has profile data
      if(Object.keys(profile).length > 0 ) {
dashboardContent= (
<div>
<p className="lead dashboard text-black">Welcome <Link to={`/profile/${profile.handle}`}></Link>{ user.name }!</p>
<ProfileActions/>
<Experience  experience={profile.experience}/>
<Education education={profile.education} />
<div stype={{ marginBottom: '60px' }}/>
<button onClick={this.onDeleteClick.bind(this)} className="btn btn-danger"> Delete My Account</button>
</div>
  )
      } else {
//user is logged in w no profile
dashboardContent = (
  <div><p className="lead dash-add text-black">Welcone { user.name }!</p>
  <p>You have not yet setup a profile, please add your info...</p>
  <Link  to="/create-profile" className="btn btn-lg btn-info"> Create Profile</Link></div>
)
      }
     }
    return (
      <div className="dashbaord">
        <div className="row"><div className="dashboard-stuff col-md-12">
        <h1 className="display-4">Dashboard</h1>
        {dashboardContent}
        </div></div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired, 
  profile: PropTypes.object.isRequired
}

const mSTP = state => ({
  profile: state.profile,
  auth: state.auth,
  
});

export default connect(mSTP, { getCurrentProfile, deleteAccount })(Dashboard); 