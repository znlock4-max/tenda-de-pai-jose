export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface OrixaInfo {
  name: string;
  colors: string;
  element: string;
  day: string;
  description: string;
  image: string;
}

export interface HerbInfo {
  name: string;
  usage: string;
  type: 'Quente' | 'Morna' | 'Fria';
}
