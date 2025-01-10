function Register(){
    return (
        <>
            <input id="userName" type="text" title="username">

            </input>
            <input id="insertEmail" type="email" title="email">

            </input>
            <input id="birthDate" type="datetime-local">

            </input>
            <input id="createPassword" type="password">

            </input>
            <input id="confirmPassword" type="password">

            </input>
            <input id="termsOfService" type="checkbox" name="termsOfService" />
            <input id="enter" type="submit">
                Create Account
            </input>
        </>
    )
}

export default Register;