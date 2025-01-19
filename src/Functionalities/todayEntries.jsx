import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Asumiendo que usas axios para las llamadas API

const useCheckTodayEntry = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkTodayEntry = async () => {
            const today = new Date().toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            try {
                // Comprobar si existe una entrada para hoy
                const response = await axios.get(`/api/entries/`);
                const todayEntry = response.data.find(entry => entry.fecha_creacion === today);
                if (response.data) {

                    navigate(`/entry/${today}`); //TODO(corregir el navigate si existe la entrada de hoy)
                } else {
                    // La entrada no existe, crearla y redirigir
                    // No existe una entrada para hoy, crear una nueva
                    const newEntryData = {
                        titulo: `Entrada del ${today}`,
                        contenido: {
                            palabras_clave: '',
                            eventos_clave: '',
                            resumen: ''
                        },
                        fecha_creacion: today,
                        autor_username: username,
                        chat: {
                            fecha_creacion: today,
                            mensajes: []
                        }
                    };
                    const newEntry = await axios.post('/api/entries', newEntryData);
                    navigate(`/entry/${newEntry.data._id}`); //TODO(corregir el navigate al crear la entrada)
                }
            } catch (error) {
                console.error("Error al comprobar la entrada de hoy:", error);
                // Manejar el error (por ejemplo, mostrar un mensaje al usuario)
            } finally {
                setIsLoading(false);
            }
        };

        checkTodayEntry();
    }, [navigate]);

    return isLoading;
};

export default useCheckTodayEntry;
