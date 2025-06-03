
export interface GameData {
  story: string;
  imagePrompt: string;
  choices: string[];
  gameOver: boolean;
}

export interface Scene {
  story: string;
  imagePrompt: string;
  imageUrl?: string; // Base64 data URL
}

export type GameState = 'welcome' | 'playing' | 'gameOver' | 'error';

// Grounding metadata structure from Gemini if using search
export interface WebSource {
  uri: string;
  title: string;
}
export interface GroundingChunk {
  web?: WebSource;
  // Other types of chunks can be added here if needed
}

// Types for Imagen Image Generation
export interface ImageGenerateConfig {
  numberOfImages?: number;
  outputMimeType?: string; // e.g., 'image/jpeg', 'image/png'
  seed?: number; 
  // AspectRatio currently not supported in @google/genai, but good to keep in mind
  // aspectRatio?: string; // e.g., "1:1", "16:9", "4:3" 
}

export interface ImageGenerateParams {
  model: string;
  prompt: string;
  config?: ImageGenerateConfig;
}

export interface GeneratedImage {
  image?: { // Made image property optional
    imageBytes?: string; // Base64 encoded image data
  };
  seed?: number; // The seed used for generating this image, if available
}

export interface ImageGenerateResponse {
  generatedImages: GeneratedImage[];
}