import React from 'react';
import { Block } from '../types/blockchain';
import { Clock, Box, Hash, Link } from 'lucide-react';
import { BlockArt } from './BlockArt';

interface BlockViewProps {
  block: Block;
  isLatest: boolean;
}

export const BlockView: React.FC<BlockViewProps> = ({ block, isLatest }) => {
  return (
    <div
      className={`p-6 rounded-lg shadow-lg ${
        isLatest
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
          : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Box className="w-6 h-6" />
          <span className="text-lg font-bold">Block #{block.index}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {new Date(block.timestamp).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <BlockArt pattern={block.artPattern} size={300} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Hash className="w-4 h-4" />
          <span className="text-sm font-mono truncate">{block.hash}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Link className="w-4 h-4" />
          <span className="text-sm font-mono truncate">
            {block.previousHash}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Transactions</h3>
        <div className="space-y-2">
          {block.transactions.map((tx) => (
            <div
              key={tx.id}
              className="text-sm p-2 rounded bg-opacity-20 bg-gray-100"
              style={{ borderLeft: `4px solid ${tx.color}` }}
            >
              <div className="flex justify-between">
                <span className="truncate w-24">{tx.from}</span>
                <span>→</span>
                <span className="truncate w-24">{tx.to}</span>
              </div>
              <div className="text-right font-mono">
                {tx.amount.toFixed(2)} COIN
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-sm">
        <div className="flex justify-between">
          <span>Nonce: {block.nonce}</span>
          <span>Difficulty: {block.difficulty}</span>
        </div>
      </div>
    </div>
  );
};