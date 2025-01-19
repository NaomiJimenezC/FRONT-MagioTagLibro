import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const useCheckTodayEntry = (username) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const checkTodayEntry = async () => {
        setIsLoading(true);
        const today = new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        try {
            const response = await axios.get(`/api/entries/`);
            const todayEntry = response.data.find(entry => entry.fecha_creacion === today);

            if (todayEntry) {
                navigate(`/entry/${todayEntry._id}`);
            } else {
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
                navigate(`/entry/${newEntry.data._id}`);
            }
        } catch (error) {
            console.error("Error al comprobar la entrada de hoy:", error);
            // Manejar el error (por ejemplo, mostrar un mensaje al usuario)
        } finally {
            setIsLoading(false);
        }
    };

    return { checkTodayEntry, isLoading };
};

export default useCheckTodayEntry;
