import React, { useEffect, useState } from 'react';
import { Block, Transaction, PendingTransaction } from './types/blockchain';
import { mineBlock, generateKeyPair, createGenesisBlock } from './utils/blockchain';
import { generateArtFromTransactions } from './utils/artGenerator';
import { BlockView } from './components/BlockView';
import { TransactionForm } from './components/TransactionForm';
import { BoxesIcon, Coins, Activity } from 'lucide-react';

function App() {
  const [blockchain, setBlockchain] = useState<Block[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [userKeyPair] = useState(generateKeyPair());
  const [mining, setMining] = useState(false);

  useEffect(() => {
    const initBlockchain = async () => {
      const genesisBlock = await createGenesisBlock();
      setBlockchain([genesisBlock]);
    };
    initBlockchain();
  }, []);

  const addTransaction = (pendingTx: PendingTransaction) => {
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      ...pendingTx,
      timestamp: Date.now(),
    };

    setPendingTransactions((prev) => [...prev, transaction]);
  };

  const mineNewBlock = async () => {
    if (mining || pendingTransactions.length === 0) return;

    setMining(true);
    const previousBlock = blockchain[blockchain.length - 1];
    const newBlock: Block = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      transactions: [...pendingTransactions],
      previousHash: previousBlock.hash,
      hash: '',
      nonce: 0,
      difficulty: 4,
      artPattern: {
        shapes: [],
        background: '#ffffff',
      },
    };

    const { hash, nonce } = await mineBlock(newBlock, newBlock.difficulty);
    newBlock.hash = hash;
    newBlock.nonce = nonce;
    newBlock.artPattern = generateArtFromTransactions(newBlock.transactions, hash);

    setBlockchain((prev) => [...prev, newBlock]);
    setPendingTransactions([]);
    setMining(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BoxesIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Proof of Art Chain
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Your Address: {userKeyPair.publicKey}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <BoxesIcon className="w-5 h-5 mr-2" />
                  Blockchain Gallery
                </h2>
                <span className="text-sm text-gray-500">
                  {blockchain.length} blocks
                </span>
              </div>
              <div className="space-y-4">
                {blockchain.map((block, index) => (
                  <BlockView
                    key={block.hash}
                    block={block}
                    isLatest={index === blockchain.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <Coins className="w-5 h-5 mr-2" />
                New Transaction
              </h2>
              <TransactionForm
                onSubmit={addTransaction}
                userAddress={userKeyPair.publicKey}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <Activity className="w-5 h-5 mr-2" />
                Pending Transactions
              </h2>
              <div className="space-y-4">
                {pendingTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="text-sm p-2 rounded bg-gray-50"
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
                {pendingTransactions.length === 0 && (
                  <p className="text-gray-500 text-sm text-center">
                    No pending transactions
                  </p>
                )}
              </div>
              <button
                onClick={mineNewBlock}
                disabled={mining || pendingTransactions.length === 0}
                className={`mt-4 w-full py-2 px-4 rounded-md text-white ${
                  mining || pendingTransactions.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {mining ? 'Mining...' : 'Mine New Block'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;