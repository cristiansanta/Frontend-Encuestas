export const Surveyquestions = async () => {
    // Declaramos las variables correctamente usando const
    const survey_id = localStorage.getItem('id_survey') || null;
    const question_id = localStorage.getItem('questions_id') || null;
    const section_id = localStorage.getItem('section_id') || null;

    // Objeto con los datos
    const Datasurveyquestion = {
        survey_id,
        question_id,
        section_id,
        creator_id: 1,
        status: true,
        user_id: 1
    };

    // Usar variable de entorno para el endpoint
    const endpoint = import.meta.env.VITE_API_ENDPOINT + 'surveyquestion/store';

    try {
        // Verificar que los datos requeridos no sean nulos
        if (!survey_id || !question_id || !section_id) {
            console.error("Faltan datos necesarios para la petición");
            return;
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Si usas autenticación
            },
            body: JSON.stringify(Datasurveyquestion)
        });
       
        // Manejar la respuesta del servidor
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        localStorage.removeItem("selectedOptionId");
        localStorage.removeItem("questions_id");
        
        
    } catch (error) {
        console.error("Error al realizar la petición:", error);
    }
};

