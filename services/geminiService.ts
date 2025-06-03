
import { GoogleGenAI, GenerateContentResponse, GenerateContentParameters } from "@google/genai";
import { GameData, ImageGenerateParams, ImageGenerateResponse } from '../types';
import { GEMINI_TEXT_MODEL, IMAGEN_MODEL, API_KEY_ERROR_MESSAGE, GEMINI_TTS_MODEL, TTS_VOICE } from '../constants';

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!process.env.API_KEY) {
    console.error(API_KEY_ERROR_MESSAGE);
    throw new Error(API_KEY_ERROR_MESSAGE);
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const parseJsonFromText = (text: string): any => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Falha ao analisar resposta JSON:", e, "Texto original:", text);
    throw new Error("Resposta JSON inválida da IA.");
  }
};

export const generateInitialScene = async (playerName: string, theme: string): Promise<GameData> => {
  const client = getAiClient();
  const prompt = `
System Instruction: Você é um mestre contador de histórias criando um jogo de aventura de texto interativo em Português-Brasil.
O nome do jogador é ${playerName}.
O tema do jogo é "uma ${theme}".
Comece o jogo com um cenário introdutório intrigante em Português-Brasil.
Gere:
1.  Um parágrafo curto da história para a cena atual (cerca de 100-150 palavras) em Português-Brasil.
2.  Um prompt de imagem conciso e vívido EM INGLÊS (max 10-15 palavras, adequado para um gerador de imagens AI como Imagen) que represente visualmente esta cena. O prompt deve focar em elementos chave, atmosfera e estilo. Exemplo EM INGLÊS: "Ancient glowing rune stone, misty forest path, ethereal light".
3.  Exatamente 3 escolhas distintas e envolventes para o jogador continuar a aventura, em Português-Brasil. Cada escolha deve ser uma frase curta.
Garanta que toda a sua resposta seja um único objeto JSON válido com a seguinte estrutura:
{
  "story": "string (em Português-Brasil)",
  "imagePrompt": "string (em INGLÊS)",
  "choices": ["string (em Português-Brasil)", "string (em Português-Brasil)", "string (em Português-Brasil)"],
  "gameOver": false
}
Não inclua nenhum texto fora deste objeto JSON. Não use formatação markdown para o JSON.
`;

  const params: GenerateContentParameters = {
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: 'user', parts: [{text: prompt}] }],
    config: {
        responseMimeType: "application/json",
        temperature: 0.7, 
    }
  };

  try {
    const response: GenerateContentResponse = await client.models.generateContent(params);
    const gameData = parseJsonFromText(response.text) as GameData;
    if (!gameData.story || !gameData.imagePrompt || !Array.isArray(gameData.choices) || gameData.choices.length === 0) {
        throw new Error("A resposta da IA não contém campos obrigatórios para a cena inicial.");
    }
    return gameData;
  } catch (error) {
    console.error("Error generating initial scene:", error);
    if (error instanceof Error && error.message.includes("API Key") || error instanceof Error && error.message.includes("Chave de API")) {
        throw new Error(API_KEY_ERROR_MESSAGE);
    }
    throw new Error("Falha ao gerar a cena inicial do jogo. A IA pode estar ocupada ou ocorreu um erro.");
  }
};

export const generateNextScene = async (previousStory: string, playerChoice: string, playerName: string, theme: string): Promise<GameData> => {
  const client = getAiClient();
  const prompt = `
System Instruction: Você é um mestre contador de histórias continuando um jogo de aventura de texto interativo em Português-Brasil.
O nome do jogador é ${playerName}.
O tema do jogo é "uma ${theme}".
A história da cena anterior foi: "${previousStory}".
O jogador escolheu: "${playerChoice}".

Baseado na escolha do jogador, continue a história em Português-Brasil. Torne-a envolvente e garanta que siga logicamente a escolha.
A história pode levar à descoberta, perigo, resolução, ou até mesmo a um estado de fim de jogo.
Gere:
1.  Um novo parágrafo curto da história para a cena atual (cerca de 100-150 palavras) em Português-Brasil.
2.  Um prompt de imagem conciso e vívido EM INGLÊS (max 10-15 palavras) para a nova cena. Exemplo EM INGLÊS: "Dark cave entrance, dripping water, faint torchlight".
3.  Exatamente 3 escolhas distintas para o jogador relevantes para a nova cena, em Português-Brasil. Se o jogo terminar, a história deve indicar claramente o fim (sucesso ou fracasso), e o array de escolhas deve conter uma única opção como "Jogar Novamente?". Se não for fim de jogo, forneça 3 escolhas.
Garanta que toda a sua resposta seja um único objeto JSON válido com a seguinte estrutura:
{
  "story": "string (em Português-Brasil)",
  "imagePrompt": "string (em INGLÊS)",
  "choices": ["string (em Português-Brasil)", "string (em Português-Brasil)", "string (em Português-Brasil)"],
  "gameOver": boolean
}
Não inclua nenhum texto fora deste objeto JSON. Não use formatação markdown para o JSON.
`;
  const params: GenerateContentParameters = {
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: 'user', parts: [{text: prompt}] }],
    config: {
        responseMimeType: "application/json",
        temperature: 0.75, 
    }
  };

  try {
    const response: GenerateContentResponse = await client.models.generateContent(params);
    const gameData = parseJsonFromText(response.text) as GameData;
     if (!gameData.story || !gameData.imagePrompt || !Array.isArray(gameData.choices) || gameData.choices.length === 0) {
        throw new Error("A resposta da IA não contém campos obrigatórios para a próxima cena.");
    }
    return gameData;
  } catch (error) {
    console.error("Error generating next scene:", error);
     if (error instanceof Error && error.message.includes("API Key") || error instanceof Error && error.message.includes("Chave de API")) {
        throw new Error(API_KEY_ERROR_MESSAGE);
    }
    throw new Error("Falha ao gerar a próxima cena do jogo. A IA pode estar ocupada ou ocorreu um erro.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const client = getAiClient();
  const params: ImageGenerateParams = {
    model: IMAGEN_MODEL,
    prompt: prompt, 
    config: { numberOfImages: 1, outputMimeType: 'image/jpeg' }
  };

  try {
    const response = await client.models.generateImages(params) as ImageGenerateResponse;

    if (response.generatedImages && 
        response.generatedImages.length > 0 && 
        response.generatedImages[0].image &&
        response.generatedImages[0].image.imageBytes) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("Nenhuma imagem gerada ou os dados da imagem estão vazios.");
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error && error.message.includes("API Key") || error instanceof Error && error.message.includes("Chave de API")) {
        throw new Error(API_KEY_ERROR_MESSAGE);
    }
    console.warn("Retornando para imagem de placeholder devido a erro na geração.");
    return "https://picsum.photos/512/512?blur=2&grayscale"; 
  }
};

// --- TTS com Gemini ---

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

interface AudioMimeParameters {
  bitsPerSample: number;
  rate: number;
}

function parseAudioMimeType(mimeType: string): AudioMimeParameters {
  let bitsPerSample = 16; // Padrão para audio/L16
  let rate = 24000;      // Padrão para audio/L16

  const parts = mimeType.split(';');
  for (const param of parts) {
    const trimmedParam = param.trim().toLowerCase();
    if (trimmedParam.startsWith('rate=')) {
      try {
        const rateStr = trimmedParam.substring(5);
        const parsedRate = parseInt(rateStr, 10);
        if (!isNaN(parsedRate)) {
          rate = parsedRate;
        }
      } catch (e) { /* Ignorar erro de parsing, manter padrão */ }
    } else if (trimmedParam.startsWith('audio/l')) { // Ex: audio/L16, audio/L24
      try {
        const bitsStr = trimmedParam.substring('audio/l'.length);
        const parsedBits = parseInt(bitsStr, 10);
        if (!isNaN(parsedBits)) {
          bitsPerSample = parsedBits;
        }
      } catch (e) { /* Ignorar erro de parsing, manter padrão */ }
    }
  }
  return { bitsPerSample, rate };
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function createWavHeader(audioDataLength: number, params: AudioMimeParameters, numChannels: number = 1): ArrayBuffer {
  const { bitsPerSample, rate } = params;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = rate * blockAlign;
  const dataSize = audioDataLength;

  const buffer = new ArrayBuffer(44); // Cabeçalho WAV tem 44 bytes
  const view = new DataView(buffer);

  // Bloco RIFF
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // ChunkSize (tamanho total do arquivo - 8 bytes)
  writeString(view, 8, 'WAVE');

  // Sub-bloco "fmt "
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 para PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 para PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, rate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample

  // Sub-bloco "data"
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true); // Subchunk2Size (tamanho dos dados de áudio)

  return buffer;
}

export const generateSpeechFromText = async (text: string): Promise<string | null> => {
  const client = getAiClient();
  
  const ttsParams = {
    model: GEMINI_TTS_MODEL,
    contents: [{ role: 'user', parts: [{ text: text }] }],
    config: {
      // temperature: 1, // A temperatura pode não ser aplicável para TTS, mas estava no exemplo Python. Removido por segurança.
      responseModalities: ['audio'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: TTS_VOICE,
          }
        }
        // outputAudioEncoding: "OUTPUT_AUDIO_ENCODING_LINEAR_16" // É o padrão, não precisa especificar.
      }
    }
  };

  try {
    const responseStream = await client.models.generateContentStream(ttsParams);
    
    const audioDataChunks: string[] = []; // Armazena os pedaços de dados de áudio (base64)
    let audioMimeType: string | null = null;

    for await (const chunk of responseStream) {
      // A estrutura exata do chunk pode variar, é preciso inspecionar ou consultar a documentação para JS SDK
      // Baseado no exemplo Python, esperamos inlineData
      const part = chunk.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData?.data) {
        audioDataChunks.push(part.inlineData.data);
        if (!audioMimeType && part.inlineData.mimeType) {
          audioMimeType = part.inlineData.mimeType; // Ex: "audio/L16;rate=24000"
        }
      }
    }

    if (audioDataChunks.length > 0 && audioMimeType) {
      const concatenatedBase64 = audioDataChunks.join('');
      const rawAudioData = base64ToUint8Array(concatenatedBase64);
      
      const audioParams = parseAudioMimeType(audioMimeType);
      const header = createWavHeader(rawAudioData.length, audioParams);
      
      const wavData = new Uint8Array(header.byteLength + rawAudioData.length);
      wavData.set(new Uint8Array(header), 0);
      wavData.set(rawAudioData, header.byteLength);
      
      const blob = new Blob([wavData], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    }
    
    console.warn("Nenhum dado de áudio recebido do serviço TTS.");
    return null;

  } catch (error) {
    console.error("Erro ao gerar áudio com Gemini TTS:", error);
    if (error instanceof Error && error.message.includes("API Key") || error instanceof Error && error.message.includes("Chave de API")) {
        throw new Error(API_KEY_ERROR_MESSAGE);
    }
    throw new Error("Falha ao gerar narração com IA.");
  }
};
