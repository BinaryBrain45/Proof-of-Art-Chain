export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  artPattern: ArtPattern;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  color: string;
}

export interface PendingTransaction {
  from: string;
  to: string;
  amount: number;
  color: string;
}

export interface ArtPattern {
  shapes: Shape[];
  background: string;
}

export interface Shape {
  type: 'circle' | 'rectangle' | 'line';
  x: number;
  y: number;
  size: number;
  color: string;
  rotation?: number;
}