// mergeSurveyData.js

/**
 * Este script genera el JSON principal de la encuesta
 * uniendo la configuración inicial (categorías y encuestas)
 * con la configuración específica (banco de preguntas).
 */

import { getSections } from './SurveyFormStorage.js';
import { getBankQuestions } from './bankQuestionsStorage.js';

const categorias = getSections();           // Array de secciones/encuestas
const bancoDePreguntas = getBankQuestions(); // Array de preguntas del banco

const encuestaPrincipal = {
  categorias,
  bancoDePreguntas
};

// Para ver por consola el JSON resultante (opcional):
console.log(
  'Encuesta principal:',
  JSON.stringify(encuestaPrincipal, null, 2)
);

// Exporta el JSON para usarlo en tu aplicación
export default encuestaPrincipal;
