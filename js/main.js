const letras = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const letrasContainer = document.getElementById("letras-container");
const audioPlayer = document.getElementById("audioPlayer");
const loadingMessage = document.getElementById("loading-message");

function criarBotoesLetras() {
  letras.forEach((letra) => {
    const button = document.createElement("button");
    button.classList.add("letra-button");
    button.innerHTML = `<span>${letra}</span>`;
    button.dataset.letra = letra;
    button.addEventListener("click", () => falarLetra(letra));
    letrasContainer.appendChild(button);
  });
}

async function falarLetra(letra) {
  const textToSpeak = letra;

  loadingMessage.style.display = "block";
  audioPlayer.src = "";

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_CLOUD_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { text: textToSpeak },
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na API:", errorData);
      alert("Erro ao gerar o som. Verifique sua chave de API.");
      loadingMessage.style.display = "none";
      return;
    }

    const data = await response.json();
    const audioContent = data.audioContent;

    audioPlayer.src = "data:audio/mp3;base64," + audioContent;
    audioPlayer.play();

    audioPlayer.onended = () => {
      loadingMessage.style.display = "none";
    };
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro na requisição da API. Veja o console.");
    loadingMessage.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", criarBotoesLetras);
