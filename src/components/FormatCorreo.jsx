// FormatCorreo.js
const FormatCorreo = (correo, surveyId) => {
  // Función para codificar los datos en Base64
  const encodeData = (data) => {
    return btoa(JSON.stringify(data));
  };

  // Codificar los datos
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
  const encodedData = encodeData({ correo, surveyId });
  const asunto = "Encuesta Académica";
  const cuerpoBase = `
    <!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Encuesta Académica</title>
</head>
<body style="font-family: Arial, sans-serif; color: #00324D;">
<div style="display: flex; width: 600px; background-color: #f5f5f5; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden; margin: 20px auto;">
<div style="width: 10%; background-color: #39a900;"></div>
<div style="padding: 20px; width: 90%;">
  <h1 style="color: #00324D; font-size: 24px; display: flex; align-items: center;">
    <img src="cid:logo_cid" style="display: inline-block; width: 50px; margin-right: 10px;" /> Encuesta Académica
  </h1>
  <p style="color: #00324D; font-weight: bold; margin: 0 0 10px 0;">
    Estimado Usuario:
  </p>
  <p style="color: #04324d; line-height: 1.5;">
    Te invitamos a responder la encuesta en el siguiente enlace. En caso de que el enlace no cargue, por favor contacta con el soporte técnico.
  </p>
  <p style="text-align: center; margin: 20px 0;">
    <a href="${apiEndpoint}/survey-view?data=${encodedData}" style="color: #39a900; font-weight: bold; text-decoration: none;">
      Responder Encuesta
    </a>
  </p>
  <p style="font-size: 12px; color: #00324D; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
    Este es un mensaje automatizado, por favor no respondas a este correo.<br />
    &#169; 2024
  </p>
</div>
</div>
</body>
</html>
  `;

  return { asunto, correo, cuerpo: cuerpoBase };
};

export default FormatCorreo;
