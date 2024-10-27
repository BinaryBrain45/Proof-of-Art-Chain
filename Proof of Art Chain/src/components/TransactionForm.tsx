import React, { useState } from 'react';
import { PendingTransaction } from '../types/blockchain';
import { generateRandomColor } from '../utils/artGenerator';

interface TransactionFormProps {
  onSubmit: (transaction: PendingTransaction) => void;
  userAddress: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  userAddress,
}) => {
  const [transaction, setTransaction] = useState<PendingTransaction>({
    from: userAddress,
    to: '',
    amount: 0,
    color: generateRandomColor(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(transaction);
    setTransaction({
      ...transaction,
      to: '',
      amount: 0,
      color: generateRandomColor(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">From</label>
        <input
          type="text"
          value={userAddress}
          disabled
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">To</label>
        <input
          type="text"
          value={transaction.to}
          onChange={(e) =>
            setTransaction({ ...transaction, to: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount (COIN)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={transaction.amount}
          onChange={(e) =>
            setTransaction({
              ...transaction,
              amount: parseFloat(e.target.value),
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <span
          className="w-6 h-6 rounded-full border-2 border-white"
          style={{ backgroundColor: transaction.color }}
        />
        <span className="text-sm text-gray-600">
          Transaction Color (Auto-generated)
        </span>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Send Transaction
      </button>
    </form>
  );
};