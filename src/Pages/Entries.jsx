import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../Components/NavBar.jsx";
import useCheckTodayEntry from "../Functionalities/todayEntries.jsx";
import Button from "../Components/Button.jsx"; // Asumiendo que tienes un componente Button

const Entries = () => {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { checkTodayEntry, isLoading: isTodayEntryLoading } = useCheckTodayEntry(username);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await axios.get('/api/entries/');
                setEntries(response.data);
                setIsLoading(false);
            } catch (err) {
                setError('Error al cargar las entradas');
                setIsLoading(false);
            }
        };

        fetchEntries();
    }, []);

    if (isLoading) return <div>Cargando entradas...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <Navbar />
            <main role="main">
                <section>
                    <h2>Mis Entradas de Diario</h2>
                    {entries.length > 0 ? (
                        <ul>
                            {entries.map(entry => (
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
            </main>
        </>
    );
};
export default Entries;