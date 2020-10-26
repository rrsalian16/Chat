import React, { Component } from "react";
import { Formik, Form } from "formik";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ROUTES from "../../configs/routes";
import { ActionRouteNavigate } from "../../store/actions/action-route";
import { ActionLogin } from "../../store/actions/action-user";

import InputText from "../../components/Form/InputText";


import "./Login.css";


class Login extends React.Component {
  hanldeSubmit = (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
           this.props.ActionLogin(values);
           resetForm();
           setSubmitting(false);
      }, 3000);
  };

  render() {
    return (
      <div className="login">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={this.hanldeSubmit}
        >
          {({ values, handleBlur, handleChange, isSubmitting }) => (
            <Form className="login-form" onLoad={this.initialize}>
              <div className="box">
                <div className="logo-msg">
                  <b>Welcome to Chat.</b>
                  <p>Please login to continue</p>
                </div>
                <section>
                  <InputText
                    name="email"
                    type="email"
                    label={"Email"}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <InputText
                    name="password"
                    type="password"
                    label={"Password"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </section>
                <div className="btn-group">
                  <button
                    className="success"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "LOADING" : "LOGIN"}
                  </button>
              <p style={{textAlign:"center",cursor:"pointer"}} onClick={()=>this.props.ActionRouteNavigate(ROUTES.SIGN_IN)} >SIGN UP</p>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

function mapStateToProps({ rLoading, rUser }) {
    return {
        isLoading: rLoading.authenticating
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ActionLogin,
        ActionRouteNavigate
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
