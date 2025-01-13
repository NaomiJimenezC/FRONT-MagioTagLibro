import * as Formik from 'formik'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const registerForm = () => {
    const formik = useFormik({
        initialValues : {
            userName: "",
            email: "",
            newPassword: "",
            confirmPassword: "",
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2))
        }
    })

    const validationSchema = Yup.object({
        userName: Yup.string()
            .required("Username is required")
            .min(5, "Username must be at least 5 characters"),
        email: Yup.string()
            .required("Email is required")
            .email("Email is required"),
        password: Yup.string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters"),
        confirmPassword: Yup.string()
            .required("Confirm Password is required")
            .oneOf([Yup.ref("password"), null], "Passwords must match")
    })
}

function Registerform(){
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
        >
        <form method="get" onSubmit={registerForm.formik.handleSubmit}>
            <p>Username</p>
            <input id="userName" type="text" name="username" onChange={registerForm.formik.handleChange}
                   value={registerForm.formik.initialValues.userName}>

            </input>
            <p>E-mail</p>
            <input id="insertEmail" type="email" name="email" onChange={registerForm.formik.handleChange}
                   value={registerForm.formik.initialValues.email}>

            </input>
            <p>Create Password</p>
            <input id="createPassword" type="password" onChange={registerForm.formik.handleChange}
                   value={registerForm.formik.initialValues.newPassword}>

            </input>

            <input id="confirmPassword" type="password" onChange={registerForm.formik.handleChange}
                   value={registerForm.formik.initialValues.confirmPassword}>

            </input>
            <input id="termsOfService" type="checkbox" name="termsOfService" onChange={registerForm.formik.handleChange}/>

            <input id="enter" type="submit" value="Create Account" onChange={registerForm.formik.submit}/>
        </form>
        </Formik>
    )
}

export default Registerform;