import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import Input from "../../form/Input"

import styles from '../../form/Form.module.css'

/* Context */
import { Context } from "../../../context/UserContext"

function Login(){
    const [user, setUser]= useState({})
    const {login} = useContext(Context)

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }
    
    function handleSubmit(e) {
        e.preventDefault()
        login(user)
    }

    return(
        <section className={styles.form_container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    type='email'
                    text='E-mail'
                    name='email'
                    placeholder='Digite seu E-mail'
                    handleOnChange={handleChange}
                />
                <Input
                    type='password'
                    text='Senha'
                    name='password'
                    placeholder='Digite sua senha'
                    handleOnChange={handleChange}
                />
                <input type="submit" value="Entrar"/>
            </form>
            <p>
                Não tem conta? <Link to= "/register">Registre-se</Link>
            </p>
        </section>
    )
}

export default Login