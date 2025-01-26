import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../Components/NavBar.jsx";
import useCheckTodayEntry from "../Functionalities/todayEntries.jsx";
import Button from "../Components/Button.jsx"; // Asumiendo que tienes un componente Button

const Entries = () => {
    const backurl = process.env.BACKEND_URL;
    const [user, setUser] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { checkTodayEntry, isLoading: isTodayEntryLoading } = useCheckTodayEntry(user?.username);

    useEffect(() => {
        const fetchUser = () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                if (storedUser) {
                    setUser(storedUser);
                    return storedUser.username;
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError(error);
            }
            return null;
        };

        const fetchEntries = async (username) => {
            try {
                if (username) {
                    const response = await axios.get(`${backurl}/api/entries/${username}`);
                    setEntries(response.data);
                }
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        setIsLoading(true);
        const username = fetchUser();
        if (username) {
            fetchEntries(username);
        } else {
            setIsLoading(false);
        }
    }, [backurl]);

    const entradasPropias = useMemo(() =>
            entries.filter(entrada => entrada.username === user?.username),
        [entries, user]
    );

    const entradasCompartidas = useMemo(() =>
            entries.filter(entrada => entrada.username !== user?.username),
        [entries, user]
    );

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }


    return (
        <>
            <Navbar />
            <main role="main">
                <section>
                    <h2>Mis Entradas de Diario</h2>
                    {entradasPropias.length > 0 ? (
                        <ul>
                            {entradasPropias.map(entry => (
                                //TODO(componente react de las entradas)
                                <li key={entry._id}>
                                    <Link to={`/entry/${entry._id}`}>
                                        {entry.titulo} - {entry.fecha_creacion}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay entradas disponibles.</p>
                    )}
                </section>
                <section>
                    <h2>Ir a la entrada de hoy</h2>
                    <Button
                        onClick={checkTodayEntry}
                        text={isTodayEntryLoading ? "Cargando..." : "Entrada de hoy"}
                        disabled={isTodayEntryLoading}
                    />
                </section>

                <section>
                    <h1>Entradas compartidas</h1>
                    {entradasCompartidas.length > 0 ? (
                        <ul>
                            {entradasCompartidas.map(entry => (
                                //TODO(componente react de las entradas)
                                <li key={entry._id}>
                                    <Link to={`/entry/${entry._id}`}>
                                        {entry.titulo} - {entry.fecha_creacion}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay entradas disponibles.</p>
                    )}
                </section>
            </main>
        </>
    );
};
export default Entries;
