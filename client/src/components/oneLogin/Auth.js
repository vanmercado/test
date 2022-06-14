import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { parse } from "query-string";
import jwtDecode from "jwt-decode";
import isEmpty from "lodash/isEmpty";
import Loader from "react-loader";

import { receiveAccessToken, receiveIdToken } from "../../actions/token";
import { receiveProfileData } from "../../actions/profile";
import { addLoginData } from "../../actions";

export const Auth = ({
  location,
  profile,
  receiveProfile,
  receiveTokens,
  addLoginData,
}) => {
  if (isEmpty(profile)) {
    const hash = location.hash;
    const response = parse(hash);

    if (response.error) {
      alert(response.error_description);
      return <Redirect to="/onelogin" />;
    } else {
      //INSERT A ROUTE HERE!!!!!
      addLoginData(jwtDecode(response.id_token));
      receiveTokens(response.access_token, response.idToken);
      receiveProfile(jwtDecode(response.id_token));
    }
    return <Loader />;
  } else {
    return <Redirect to="/" />;
  }
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  state: state.token.state,
  nonce: state.token.nonce,
});

const mapDispatchToProps = (dispatch) => ({
  receiveProfile: (data) => dispatch(receiveProfileData(data)),
  receiveTokens: (accessToken, idToken) => {
    dispatch(receiveAccessToken(accessToken));
    dispatch(receiveIdToken(idToken));
  },
  addLoginData: (profile) => dispatch(addLoginData(profile)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
