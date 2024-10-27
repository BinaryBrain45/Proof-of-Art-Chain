import { Block, Transaction } from '../types/blockchain';
import { generateArtFromTransactions } from './artGenerator';

const hashString = async (str: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const calculateHash = async (
  index: number,
  previousHash: string,
  timestamp: number,
  data: Transaction[],
  nonce: number
): Promise<string> => {
  return await hashString(
    index + previousHash + timestamp + JSON.stringify(data) + nonce
  );
};

export const mineBlock = async (
  block: Block,
  difficulty: number
): Promise<{ hash: string; nonce: number }> => {
  let nonce = 0;
  let hash = await calculateHash(
    block.index,
    block.previousHash,
    block.timestamp,
    block.transactions,
    nonce
  );

  while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    nonce++;
    hash = await calculateHash(
      block.index,
      block.previousHash,
      block.timestamp,
      block.transactions,
      nonce
    );
  }

  return { hash, nonce };
};

export const generateKeyPair = (): { publicKey: string; privateKey: string } => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const id = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  return {
    publicKey: id.substring(0, 40),
    privateKey: id.substring(40),
  };
};

export const createGenesisBlock = async (): Promise<Block> => {
  const block: Block = {
    index: 0,
    timestamp: Date.now(),
    transactions: [],
    previousHash: '0',
    hash: '',
    nonce: 0,
    difficulty: 4,
    artPattern: {
      shapes: [],
      background: '#f0f0f0',
    },
  };

  const { hash, nonce } = await mineBlock(block, block.difficulty);
  block.hash = hash;
  block.nonce = nonce;
  block.artPattern = generateArtFromTransactions(block.transactions, hash);

  return block;
};