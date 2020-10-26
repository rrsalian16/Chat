import React, { Component } from "react";
import { Formik, Form } from "formik";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { signupFormValidationSchema } from '../../utils/utils-validation';
import ROUTES from "../../configs/routes";
import { ActionRouteNavigate } from "../../store/actions/action-route";
import InputText from "../../components/Form/InputText";
import { ActionSignup } from "../../store/actions/action-user";

import "./Signin.css";


class Signin extends React.Component {

    hanldeSubmit = (values) => {
        this.props.ActionSignup(values)
    }

    render() {
        return (
            <div className="login">
                <Formik
                    initialValues={{
                        "email": "",
                        "password": "",
                        "confirmpassword": "",
                    }}
                    validationSchema={signupFormValidationSchema}
                    onSubmit={this.hanldeSubmit}
                    enableReinitialize
                    render={({ values, handleChange, handleBlur, errors }) => {

                        return (
                            <Form className="login-form" onLoad={this.initialize}>
                                <div className="box">
                                    <div className="logo-msg">
                                        <b>Welcome to Chat.</b>
                                        <p>Please SignIn to continue</p>
                                    </div>
                                    <section>
                                        <InputText
                                            name="email"
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
                                        <InputText
                                            name="confirmpassword"
                                            type="password"
                                            label={"confirm password"}
                                            value={values.confirmpassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </section>
                                    <div className="btn-group">
                                        <button className="success" type="submit"> SIGN_IN </button>
                                    </div>
                                    <p style={{textAlign:"center",cursor:"pointer"}} onClick={()=>this.props.ActionRouteNavigate(ROUTES.LOGIN)} >LOGIN</p>
                                </div>
                            </Form>
                        )
                    }}
                />
            </div >
        );
    }
}

function mapStateToProps({ rLoading, rUser }) {
    return {
        isLoading: rLoading.signup
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ActionSignup,
        ActionRouteNavigate
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
