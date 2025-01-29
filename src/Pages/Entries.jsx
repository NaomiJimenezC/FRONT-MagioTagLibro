import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from "../Layout/MainLayout";
import useCheckTodayEntry from "../Functionalities/TodayEntries.jsx";

const Entries = () => {
    const backurl = import.meta.env.VITE_BACKEND_URL;

    const [user, setUser] = useState(null);
    const [entries, setEntries] = useState([]);
    const [sharedEntries, setSharedEntries] = useState([])
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
                    const sharedEntries = await axios.get(`${backurl}/api/entries/shared-entries/${username}`);
                    setSharedEntries(sharedEntries.data);
                    setEntries(response.data);
                }
            } catch (error) {
                console.error("Error fetching entries:", error);
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

    const entradasPropias = entries
    const entradasCompartidas = sharedEntries

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return (
            <div>
                <h2>Ocurrió un error</h2>
                <p>{error.response?.data?.message || error.message || "Error desconocido"}</p>
            </div>
        );
    }

    return (
        <Layout>
            <main role="main">
                <section aria-labelledby="my-entries">
                    <header>
                        <h2 id="my-entries">Mis Entradas de Diario</h2>
                    </header>
                    {entradasPropias.length > 0 ? (
                        <ul>
                            {entradasPropias.map(entry => (
                                <li key={entry._id}>
                                    <Link to={`/diaries/${entry._id}`}>
                                        {entry.titulo} - {entry.fecha_creacion}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay entradas disponibles.</p>
                    )}
                </section>

                <section aria-labelledby="today-entry">
                    <header>
                        <h2 id="today-entry">Entrada de Hoy</h2>
                    </header>
                    <button
                        type="button"
                        onClick={checkTodayEntry}
                        disabled={isTodayEntryLoading}
                    >
                        {isTodayEntryLoading ? "Cargando..." : "Entrada de hoy"}
                    </button>
                </section>

                <section aria-labelledby="shared-entries">
                    <header>
                        <h2 id="shared-entries">Entradas Compartidas</h2>
                    </header>
                    {entradasCompartidas.length > 0 ? (
                        <ul>
                            {entradasCompartidas.map(entry => (
                                <li key={entry._id}>
                                    <Link to={`/diaries/${entry._id}`}>
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
        </Layout>
    );
};

export default Entries;
