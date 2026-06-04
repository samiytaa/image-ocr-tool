export interface ApiConfig {
  endpoint: string;
  apiKey: string;
  model: string;
  availableModels: string[];
}

export interface NameConfig {
  option1: string;
  option2: string;
  option3: string;
}

export type NameConfigsMap = Record<string, NameConfig>;

export interface OcrResult {
  name: string;
  usage: string;
  description: string;
  obtain: string;
  quality: string;
  gridSize: string;
}

export interface OcrFormData {
  name1: string;
  name2: string;
  name3: string;
  usage: string;
  description: string;
  obtain: string;
  quality: string;
  gridSize: string;
}

export interface SavedOcrItem {
  id: string;
  formData: OcrFormData;
  timestamp: number;
}

