// Código FINAL para a função 'api.js'
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS' ) {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] } ),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Erro da API Gemini:", data);
      return { statusCode: geminiResponse.status, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (error) {
    console.error("Erro no proxy:", error.message);
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Erro interno no proxy.' }) };
  }
};
