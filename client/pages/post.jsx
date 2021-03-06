import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserChallengePost from '../user-posts/post-form';

import quill from '../styles/images/quill.png';

class Post extends Component {
  render() {
    return (
      <div>
        <div className="jumbotron post-header">
          <img className="banner-img" src={quill} />
          <h2>
            Contribute to the Regex community 
          </h2>
          <p>Thrill your friends, confound your enemies</p>
        </div>
        <br />
        <div className='post'>
          <UserChallengePost />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    testPassed: state.newUserPost.testPassed
  }
}

export default connect(mapStateToProps)(Post);
