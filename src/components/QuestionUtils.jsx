// src/utils/questionUtils.js
import openAnswerIcon from '../assets/img/OpenAnswer.svg';
import numberIcon      from '../assets/img/number.svg';
import selectCircleIcon from '../assets/img/selectCircle.svg';
import multipleOptionIcon from '../assets/img/multipleOption.svg';
import trueFalseIcon   from '../assets/img/trueFalse.svg';
import calendarIcon    from '../assets/img/calendar2.svg';

export const questionTypes = [
  { id: 1, name: 'Respuesta Abierta', icon: openAnswerIcon },
  { id: 2, name: 'Numérica',         icon: numberIcon     },
  { id: 3, name: 'Opción Única',     icon: selectCircleIcon },
  { id: 4, name: 'Opción Múltiple',  icon: multipleOptionIcon },
  { id: 5, name: 'Falso / Verdadero',icon: trueFalseIcon  },
  { id: 6, name: 'Fecha',            icon: calendarIcon   },
];

// Devuelve el nombre de un tipo por su id
export const getQuestionTypeName = (typeId) => {
  const type = questionTypes.find(t => t.id === typeId);
  return type ? type.name : 'Desconocido';
};

// Comprueba si un HTML string tiene contenido real (texto o imágenes)
export const isDescriptionNotEmpty = (htmlString) => {
  if (!htmlString) return false;
  // imágenes o iframes cuentan como contenido
  if (/<img[^>]+>|<iframe[^>]+>/.test(htmlString)) return true;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  const textContent = (tempDiv.textContent || tempDiv.innerText || '').trim();

  // párrafos vacíos no cuentan
  const cleanHtml = htmlString.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, '').trim();

  // si no hay texto visible pero sí etiquetas distintas de br/p, también cuenta como contenido
  if (textContent === '' && cleanHtml !== '' && /<(?!(?:br|p)\b)[^>]+>/i.test(cleanHtml)) {
    return true;
  }
  return textContent.length > 0 || cleanHtml.length > 0;
};
