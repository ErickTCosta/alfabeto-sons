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

/**
 * Cria os botões das letras e adiciona ao contêiner
 */
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

/**
 * Faz requisição à função serverless para gerar áudio da letra
 * @param {string} letra - A letra clicada
 */
async function falarLetra(letra) {
  loadingMessage.style.display = "block";
  audioPlayer.src = "";

  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: letra }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Erro na API:", data.error || response.statusText);
      alert("Erro ao gerar o som. Veja o console para detalhes.");
      loadingMessage.style.display = "none";
      return;
    }

    audioPlayer.src = "data:audio/mp3;base64," + data.audioContent;
    audioPlayer.play();

    audioPlayer.onended = () => {
      loadingMessage.style.display = "none";
    };
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao se comunicar com o servidor.");
    loadingMessage.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", criarBotoesLetras);
