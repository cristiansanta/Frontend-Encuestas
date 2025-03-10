import React from 'react';

const TableSurveyEdit = ({ surveyData }) => {
  // Verificación de que surveyData y survey_questions están disponibles
  if (!surveyData || !surveyData.survey_questions) {
    return <div>No data available</div>;
  }

  const questions = surveyData.survey_questions.slice(0, 5); // Solo los primeros 5 datos

  return (
    <div>
      <h1>{surveyData.title}</h1>
      <p>{surveyData.descrip}</p>
      <p><strong>Status:</strong> {surveyData.status ? 'Active' : 'Inactive'}</p>
      <p><strong>Created At:</strong> {new Date(surveyData.created_at).toLocaleDateString()}</p>
      <p><strong>Updated At:</strong> {new Date(surveyData.updated_at).toLocaleDateString()}</p>

      <table>
        <thead>
          <tr>
            <th>Question ID</th>
            <th>Question Title</th>
            <th>Description</th>
            <th>Question Type</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((item) => {
            const question = item.question; // Obtenemos el objeto question
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{question.title}</td>
                <td>{question.descrip}</td>
                <td>{question.type.title}</td> {/* Mostrar tipo de pregunta */}
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableSurveyEdit;