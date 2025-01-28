import axios from 'axios';
import { Field, Formik } from 'formik'
import React from 'react'

export const Contact = () => {
    const initialValues = {
        subject: '',
        email_user: '',
        email_body: ''
      };
    
      const handleSubmit = (values, { setSubmitting }) => {
        // Aquí manejas el envío del formulario
        const posted = await axios 
        console.log(values);
        setSubmitting(false);
      };
    
  return (
    <main>
        <section>
            <h1>¡Contacta con nosotros!</h1>
            <p>En Magio Taglibro valoramos mucho el bienestar del usuario, debido a ello siempre estamos abiertos a escucharos. Déjanos en el formulario lo que veas necesario y te leeremos. ¡Muchas gracias!</p>
        </section>
        <section>
            <Formik>
                <Form>
                    <fieldset>
                        <legend>Contacta</legend>
                            <label htmlFor='subject'>Asunto</label>
                            <Field
                            id={"subject"}
                            name="subject"
                            as="input"
                            //falta la parte de onsubit y values
                            />

                            <Field
                                id={"email_user"}
                                name="email_user"
                                as="input"
                                //falta la parte de onsubit y values
                            />

                            <Field
                                id={"email_body"}
                                name="email_body"
                                as="textarea"
                                rows={8}
                                //falta la parte de onsubit y values
                            />

                            <button type='submit'>Enviar</button>
                    </fieldset>
                </Form>
            </Formik>
        </section>
    </main>
  )
}
