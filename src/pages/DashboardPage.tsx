import { useEffect, useState } from 'react';
import { Wallet, CreditCard, TrendingUp } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import TransactionList from '../components/TransactionList';
import AddMoneyModal from '../components/AddMoneyModal';
import { formatCurrency } from '../lib/utils';
import { useAuthStore } from '../store/authStore';
import { transactions as transactionApi } from '../lib/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
      const recentTransactions = data.slice(0, 6); 
      setTransactions(recentTransactions); 
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchTransactions(); 
    const handleFocus = () => {};
      setIsLoading(true); 
      fetchTransactions(); 

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus); //
    };
  }, []);

  const totalBalance = user?.accounts?.reduce((sum, account) => sum + account.balance, 0) || 0;
  const savingsAccount = user?.accounts?.find(acc => acc.type === 'savings'); 

  const last6credit = transactions
    .filter(txn => txn.type === 'credit') 
    .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);

  const last6debit = transactions
    .filter(txn => txn.type === 'debit') 
    .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);

  const pieChartData = [
    { name: 'Credit', value: last6credit },
    { name: 'Debit', value: last6debit },
  ];

  const COLORS = ['#82ca9d', '#ff7f50']; 

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
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1">
          <TransactionList transactions={transactions} /> {/* Display only the last 6 transactions */}
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
