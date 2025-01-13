import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik'
import * as yup from 'yup'

const registerForm = () => {
    const formik = useFormik({
        initialValues : {
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    const validationSchema = yup.object({
        userName: yup.string()
            .required("Username is required")
            .min(5, "Username must be at least 5 characters"),
        email: yup.string()
            .required("Email is required")
            .email("Email is required"),
        password: yup.string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters"),
        confirmPassword: yup.string()
            .required("Confirm Password is required")
            .oneOf([yup.ref("password"), null], "Passwords must match"),
    })
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const { username, email, password } = values
    }
}

function Registerform(){
    return (
        <Formik
            initialValues={registerForm.initialValues}
            validationSchema={registerForm.validationSchema}
            onSubmit={registerForm.handleSubmit}
        >   {({ isSubmitting }) => (

            <form method="get" onSubmit={registerForm.handleSubmit}>
                <fieldset name="userName">
                    <label htmlFor="userName">Username </label>
                    <input id="userName" type="text" name="username" onChange={registerForm.handleChange}
                           value={registerForm.initialValues}>
                    </input>
                    <ErrorMessage name="userName" component="fieldset" className="error" />
                </fieldset>

                <fieldset name="email">
                    <label htmlFor="email">E-mail </label>
                    <input id="insertEmail" type="email" name="email" onChange={registerForm.handleChange}
                           value={registerForm.initialValues}>
                    </input>
                    <ErrorMessage name="email" component="fieldset" className="error" />
                </fieldset>

                <fieldset name="password">
                    <label htmlFor="password">Password </label>
                    <input id="createPassword" type="password" onChange={registerForm.handleChange}
                           value={registerForm.initialValues}>
                    </input>
                    <ErrorMessage name="password" component="fieldset" className="error" />
                </fieldset>

                <fieldset name="confirmPassword">
                    <label htmlFor="confirmPassword">Confirm Password </label>
                    <input id="confirmPassword" type="password" onChange={registerForm.handleChange}
                           value={registerForm.initialValues}>
                    </input>
                    <ErrorMessage name="confirmPassword" component="fieldset" className="error" />
                </fieldset>

                <fieldset name="termsOfService">
                    <label htmlFor="termsOfService">I agree to the Terms of Service: </label>
                    <input id="termsOfService" type="checkbox" name="termsOfService"
                           onChange={registerForm.handleChange}/>
                    <ErrorMessage name="termsOfService" component="fieldset" className="error" />
                </fieldset>

                <fieldset name="submit">
                    <input id="submit" type="submit" value="Create Account" onChange={registerForm.submit}/>
                </fieldset>

            </form> )
            }
        </Formik>
    )
}

export default Registerform;