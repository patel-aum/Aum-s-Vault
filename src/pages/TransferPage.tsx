import { useState, useEffect } from 'react';
import { Send, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { users, transactions } from '../lib/api';
import { formatCurrency } from '../lib/utils';

interface Beneficiary {
  id: string;
  name: string;
  email: string;
  accounts: {
    id: string;
    account_number: string;
    type: string;
  }[];
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
  from_account_number: string;
  to_account_number: string;
}

export default function TransferPage() {
  const { user } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<Beneficiary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  const savingsAccount = user?.accounts?.find(acc => acc.type === 'savings');

  useEffect(() => {
    fetchBeneficiaries();
    fetchRecentTransactions();
  }, []);

  useEffect(() => {
    const filtered = beneficiaries.filter(b => 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBeneficiaries(filtered);
  }, [searchTerm, beneficiaries]);

  const fetchBeneficiaries = async () => {
    try {
      const data = await users.getAllBeneficiaries();
      setBeneficiaries(data);
      setFilteredBeneficiaries(data);
    } catch (error) {
      console.error('Failed to fetch beneficiaries:', error);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const data = await transactions.getAll();
      setRecentTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!savingsAccount) throw new Error('No savings account found');
      if (!selectedAccount) throw new Error('Please select a beneficiary account');
      if (!amount || parseFloat(amount) <= 0) throw new Error('Please enter a valid amount');

      await transactions.transfer({
        fromAccountId: savingsAccount.id,
        toAccountId: selectedAccount,
        amount: parseFloat(amount),
        description: description || 'Transfer'
      });

      setAmount('');
      setDescription('');
      setSelectedBeneficiary(null);
      setSelectedAccount('');

      fetchRecentTransactions();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Transfer failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Send className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Send Money</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleTransfer} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">Savings Account</p>
              <p className="text-sm text-gray-500">
                {savingsAccount?.account_number} - Balance: {formatCurrency(savingsAccount?.balance || 0)}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search beneficiaries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredBeneficiaries.map((beneficiary) => (
                  <div
                    key={beneficiary.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedBeneficiary?.id === beneficiary.id
                        ? 'bg-indigo-50 border-indigo-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedBeneficiary(beneficiary);
                      setSelectedAccount('');
                    }}
                  >
                    <p className="font-medium">{beneficiary.name}</p>
                    <p className="text-sm text-gray-500">{beneficiary.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedBeneficiary && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Account
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              >
                <option value="">Select an account</option>
                {selectedBeneficiary.accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_number} ({account.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>  
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              rows={3}
              placeholder="Add a note..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !selectedAccount}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="h-5 w-5" />
            {isLoading ? 'Processing...' : 'Send Money'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Transfers</h2>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {transaction.from_account_number} → {transaction.to_account_number}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`font-semibold ${
                  transaction.from_account_number === savingsAccount?.account_number
                    ? 'text-red-600' // Debit
                    : 'text-green-600' // Credit
                }`}
              >
                {transaction.from_account_number === savingsAccount?.account_number
                  ? `-${formatCurrency(transaction.amount)}`
                  : `+${formatCurrency(transaction.amount)}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
