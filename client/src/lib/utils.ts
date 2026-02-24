import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Retorna a cor do texto (preto ou branco) ideal para um fundo colorido
 */
export function getContrastColor(hexColor: string): 'white' | 'black' {
  // Remover # se presente
  const hex = hexColor.replace('#', '');
  
  // Converter para RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calcular luminosidade (fórmula padrão ITU-R BT.709)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  
  return yiq >= 128 ? 'black' : 'white';
}
