import { useEffect, useState } from 'react';
import { Wallet, CreditCard, TrendingUp } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import TransactionList from '../components/TransactionList';
import AddMoneyModal from '../components/AddMoneyModal';
import { formatCurrency } from '../lib/utils';
import { useAuthStore } from '../store/authStore';
import { transactions as transactionApi } from '../lib/api';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      const data = await transactionApi.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const handleFocus = () => {
      setIsLoading(true);
      fetchTransactions();
    };

    // Add event listener for page focus
    window.addEventListener('focus', handleFocus);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const totalBalance = user?.accounts?.reduce((sum, account) => sum + account.balance, 0) || 0;
  const savingsAccount = user?.accounts?.find(acc => acc.type === 'savings');

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <button 
          onClick={() => setIsAddMoneyModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Add Money
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          icon={<Wallet className="h-6 w-6 text-indigo-600" />}
        />
        <DashboardCard
          title="Savings Account"
          value={formatCurrency(savingsAccount?.balance || 0)}
          subtitle={`Account: ${savingsAccount?.account_number}`}
          icon={<CreditCard className="h-6 w-6 text-indigo-600" />}
        />
        <DashboardCard
          title="Investments"
          value={formatCurrency(0)}
          icon={<TrendingUp className="h-6 w-6 text-indigo-600" />}
          subtitle="Start investing today"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Account Activity</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart will be implemented with Recharts
          </div>
        </div>

        <div className="lg:col-span-1">
          <TransactionList transactions={transactions} />
        </div>
      </div>

      <AddMoneyModal
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  );
}
