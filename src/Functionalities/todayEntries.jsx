import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const useCheckTodayEntry = (username) => {
    const backurl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const checkTodayEntry = async () => {
        setIsLoading(true);
        const today = new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        console.log(username);
        try {
            const response = await axios.get(`${backurl}/api/entries/${username}/latest`);
            const todayEntry = response?.data?.fecha_creacion === today ? response.data : null;

            if (todayEntry) {
                navigate(`/diaries/${todayEntry._id}`);
            } else {
                const newEntryData = {
                    titulo: `Entrada del ${today}`,
                    contenido: {
                        palabras_clave: 'Ingrese,las,palabras,claves,así',
                        eventos_clave: ["Ingrese eventos claves"],
                        resumen: 'Ingrese el resumen de su día'
                    },
                    fecha_creacion: today,
                    autor_username: username,
                    chat: {
                        fecha_creacion: today,
                        mensajes: []
                    }
                };
                const newEntry = await axios.post(`${backurl}/api/entries/new`, newEntryData);
                navigate(`/diaries/${newEntry.data._id}`);
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
