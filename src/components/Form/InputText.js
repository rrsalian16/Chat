import React, { useState } from 'react'
import { ErrorMessage } from 'formik'
import { Input } from 'antd'
import cl from 'classnames'

import "./inputStyle.css";

const InputText = (props) => {

    const [error, setError] = useState(0);
    const { id, value, name, type, onChange, icon, onBlur, label, err, disabled, maxLength, minLength, placeholder } = props

    return (
        <div className='input input-wrapper'>
            {
                label !== undefined
                    ? <label htmlFor={name}> {label} </label>
                    : ''
            }

            {icon && <div className='iconfront'><div dangerouslySetInnerHTML={{ __html: icon }} /></div>}

            <Input
                id={id && id}
                name={name}
                disabled={disabled}
                type={type || ''}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                autoComplete="off"
                className={cl((err && error) ? 'error_input' : '')}
                style={{ padding: icon !== undefined ? '0 0 0 35px' : "10px" }}
                maxLength={maxLength}
                minLength={minLength}
            />
            <ErrorMessage name={name}>
                {errorMessage => {
                    setError(1)
                    return (
                        <p className='error_message'>
                            {errorMessage}
                        </p>
                    )
                }}
            </ErrorMessage>
        </div>
    )
}

export default InputText
