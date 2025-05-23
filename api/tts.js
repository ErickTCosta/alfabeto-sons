export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Texto é obrigatório" });
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: "pt-BR",
            name: "pt-BR-Neural2-A",
            ssmlGender: "FEMALE",
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 0.9,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ audioContent: data.audioContent });
  } catch (error) {
    console.error("Erro ao chamar a API do Google:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
