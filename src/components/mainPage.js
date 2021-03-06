import React from "react";
import { connect } from "react-redux";
import userManager from "../utils/userManager";
import { loadSubscriptionsStart, loadSubscriptionsSuccess } from "../actions";
import ChannelInfo from "./channelInfo";

class MainPage extends React.Component {
  // load the subscriptions
  componentWillMount() {
  }

  // display the current user
  showUserInfoButtonClick(event) {}

  render() {
    const { user } = this.props;

    var ReactS3Uploader = require('react-s3-uploader');

    return (
      <div style={styles.root}>
        <div style={styles.title}>
          <h3>Welcome, {user ? user.profile.name : "Mister Unknown"}!</h3>
        </div>
        <button
          onClick={event => {
            event.preventDefault();
            alert(this.props.user['access_token']);
          }}
        >
          Get Access Token
        </button>
        <button
          onClick={event => {
            event.preventDefault();
            alert(JSON.stringify(this.props.user['profile'], null, 2));
          }}
        >
          Show user info
        </button>
        <button
          onClick={() => {
            event.preventDefault();
            userManager.removeUser(); // removes the user data from sessionStorage
          }}
        >
          Logout
        </button>

        <ReactS3Uploader
          preprocess={this.onUploadStart}
          onSignedUrl={this.onSignedUrl}
          onProgress={this.onUploadProgress}
          onFinish={event => {
              var url = "s3/img/" + event.fileKey;
              userManager.removeUser();
              window.location.replace(url)
          }}
          onError={msg => {
              alert(msg);
          }}
          signingUrl="/s3/sign"
          accept="image/*"
          uploadRequestHeaders={{ 'x-amz-acl': 'private' }}
          />
      </div>
    );
  }
}

const styles = {
  root: {
    display: "flex",
    flexDirection: "column"
  },
  title: {
    flex: "1 0 auto"
  },
  list: {
    listStyle: "none"
  },
  li: {
    display: "flex"
  }
};

function mapStateToProps(state) {
  return {
    user: state.oidc.user,
    channels: state.subscriptions.channels
  };
}

export default connect(mapStateToProps)(MainPage);
