/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BringingOption = 
  | 'antipasto' 
  | 'piatto principale' 
  | 'dolci' 
  | 'super alcolici' 
  | 'vino/birra' 
  | 'regalo per la casa';

export interface Participant {
  id: string;
  name: string;
  bringing: BringingOption;
}

export interface DinnerDay {
  date: string;
  maxParticipants: number;
  participants: Participant[];
}

export interface AppState {
  days: DinnerDay[];
}

const generateInitialDays = (): DinnerDay[] => {
  const days: DinnerDay[] = [];
  
  // Maggio (16-31)
  for (let i = 16; i <= 31; i++) {
    days.push({ date: `${i} Maggio`, maxParticipants: 6, participants: [] });
  }
  
  // Giugno (1-21)
  for (let i = 1; i <= 21; i++) {
    days.push({ date: `${i} Giugno`, maxParticipants: 6, participants: [] });
  }
  
  return days;
};

export const INITIAL_DAYS: DinnerDay[] = generateInitialDays();

export const BRINGING_LABELS: Record<BringingOption, string> = {
  'antipasto': 'Antipasto',
  'piatto principale': 'Piatto Principale',
  'dolci': 'Dolci',
  'super alcolici': 'Super Alcolici',
  'vino/birra': 'Vino/Birra',
  'regalo per la casa': 'Regalo per la casa',
};
