import * as Yup from 'yup';

export const signupFormValidationSchema = Yup.object().shape({

    password: Yup.string().required('Password is required').min(6, 'Password should contain 6 characters'),
    email: Yup.string().required('Email is required')
        .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Email is wrong"),
    confirmpassword: Yup.string().oneOf([Yup.ref('password'), null], "Passwords don't match").required('Confirm Password is required'),
})
