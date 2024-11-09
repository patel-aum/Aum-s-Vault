import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { transactions } from '../lib/api';
import { formatCurrency } from '../lib/utils';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddMoneyModal({ isOpen, onClose, onSuccess }: AddMoneyModalProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, updateUser } = useAuthStore();
  const savingsAccount = user?.accounts?.find(acc => acc.type === 'savings');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!savingsAccount) throw new Error('No savings account found');

      const response = await transactions.deposit({
        accountId: savingsAccount.id,
        amount: parseFloat(amount),
      });

      // Update user's account balance
      if (user && user.accounts) {
        const updatedAccounts = user.accounts.map(acc => 
          acc.id === savingsAccount.id 
            ? { ...acc, balance: acc.balance + parseFloat(amount) }
            : acc
        );
        updateUser({ ...user, accounts: updatedAccounts });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add money');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add Money</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Add
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{formatCurrency}</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>Deposit to: Savings Account ({savingsAccount?.account_number})</p>
            <p>Current Balance: {formatCurrency(savingsAccount?.balance || 0)}</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Add Money'}
          </button>
        </form>
      </div>
    </div>
  );
}