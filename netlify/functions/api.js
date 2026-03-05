// Código Definitivo para a função 'api.js' no Netlify
exports.handler = async (event) => {
  // Headers de autorização CORS para TODAS as respostas
  const headers = {
    'Access-Control-Allow-Origin': '*', // Permite qualquer site chamar
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Responde à verificação prévia do navegador
  if (event.httpMethod === 'OPTIONS' ) {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;
    
    // A URL correta para a sua conta
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;


    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] } ),
    });

    const responseBody = await geminiResponse.text();

    // IMPORTANTE: Adiciona os headers de CORS mesmo se a resposta do Google for um erro
    if (!geminiResponse.ok) {
      console.error("Erro da API Gemini:", responseBody);
      return {
        statusCode: geminiResponse.status,
        headers, // Adiciona os headers aqui
        body: responseBody 
      };
    }

    // Adiciona os headers de CORS na resposta de sucesso
    return {
      statusCode: 200,
      headers, // Adiciona os headers aqui
      body: responseBody
    };

  } catch (error) {
    console.error("Erro no proxy:", error.message);
    // Adiciona os headers de CORS na resposta de erro do próprio proxy
    return {
      statusCode: 500,
      headers, // Adiciona os headers aqui
      body: JSON.stringify({ message: 'Erro interno no proxy.' })
    };
  }
};
