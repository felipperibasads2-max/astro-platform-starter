// Código de Diagnóstico para a função 'api.js' no Netlify
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
    // --- LOG DE DIAGNÓSTICO 1: A FUNÇÃO COMEÇOU ---
    console.log("Função iniciada. Método HTTP:", event.httpMethod );

    // --- LOG DE DIAGNÓSTICO 2: VERIFICANDO A CHAVE DE API ---
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("ERRO FATAL: A variável de ambiente GEMINI_API_KEY não foi encontrada!");
      throw new Error("A chave de API não está configurada no servidor proxy.");
    }
    console.log("Chave de API carregada com sucesso (verificando apenas a existência).");

    // --- LOG DE DIAGNÓSTICO 3: PROCESSANDO O PROMPT ---
    if (!event.body) {
        throw new Error("O corpo da requisição (body) está vazio.");
    }
    const { prompt } = JSON.parse(event.body);
    if (!prompt) {
        throw new Error("O 'prompt' não foi encontrado no corpo da requisição.");
    }
    console.log("Prompt recebido com sucesso.");

    // A URL correta para a sua conta
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    console.log("Chamando a URL do Google:", url.replace(apiKey, "CHAVE_OCULTADA" )); // Oculta a chave no log

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const responseBody = await geminiResponse.text();
    console.log("Resposta recebida do Google com status:", geminiResponse.status);

    if (!geminiResponse.ok) {
      console.error("Erro retornado pela API Gemini:", responseBody);
      return { statusCode: geminiResponse.status, headers, body: responseBody };
    }

    return { statusCode: 200, headers, body: responseBody };

  } catch (error) {
    console.error("ERRO CATASTRÓFICO NA FUNÇÃO PROXY:", error.message);
    // Envia uma resposta de erro clara de volta para o navegador
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Ocorreu um erro interno no servidor proxy.',
        error_details: error.message 
      })
    };
  }
};
