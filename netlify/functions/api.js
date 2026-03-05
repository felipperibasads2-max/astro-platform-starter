// Código FINALÍSSIMO para a função 'api.js' no Netlify
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
    
    // URL CORRIGIDA COM O MODELO E MÉTODO CORRETOS
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:streamGenerateContent?key=${apiKey}`;

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] } ),
    });

    const responseText = await geminiResponse.text();

    if (!geminiResponse.ok) {
      console.error("Erro da API Gemini:", responseText);
      return { statusCode: geminiResponse.status, headers, body: responseText };
    }
    
    // A resposta de 'streamGenerateContent' é um JSON um pouco diferente.
    // Precisamos processá-lo para extrair o texto.
    const parts = JSON.parse(responseText.replace(/^\[|\]$/g, '')); // Remove colchetes de array
    const text = parts.candidates[0].content.parts[0].text;

    // Retornamos no formato que o frontend espera
    const finalResponse = {
      candidates: [{
        content: {
          parts: [{ text: text }]
        }
      }]
    };

    return { statusCode: 200, headers, body: JSON.stringify(finalResponse) };

  } catch (error) {
    console.error("Erro no proxy:", error.message);
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Erro interno no proxy.' }) };
  }
};
