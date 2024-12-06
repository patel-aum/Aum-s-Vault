import { useEffect, useState } from 'react';
import { Vault, CreditCard, TrendingUp } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import TransactionList from '../components/TransactionList';
import AddMoneyModal from '../components/AddMoneyModal';
import { formatCurrency } from '../lib/utils';
import { useAuthStore } from '../store/authStore';
import { transactions as transactionApi } from '../lib/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Imports remain the same

export default function DashboardPage() {
  const { user, loadUserProfile, isLoading: isUserLoading, isAuthenticated } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [creditTotal, setCreditTotal] = useState(0); // New state for total credit
  const [debitTotal, setDebitTotal] = useState(0);  // New state for total debit

  // Function to refresh balance from API
  const refreshBalance = async () => {
    try {
      const balanceData = await transactionApi.getBalance();
      setTotalBalance(balanceData.total_balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  // Function to load transactions and calculate credit/debit totals
  const fetchTransactions = async () => {
    try {
      const data = await transactionApi.getAll(); // Fetch all transactions
      const recentTransactions = data.slice(0, 6); // Get the last 6 transactions
      setTransactions(recentTransactions);

      // Calculate total credit and debit amounts
      const creditSum = data
        .filter(txn => txn.type === 'credit')
        .reduce((sum, txn) => sum + parseFloat(txn.amount), 0); // Ensure amount is parsed as float

      const debitSum = data
        .filter(txn => txn.type === 'debit')
        .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);

      setCreditTotal(creditSum);
      setDebitTotal(debitSum);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user profile is loaded, and load if not
  useEffect(() => {
    if (!user && !isUserLoading) {
      loadUserProfile();
    } else {
      fetchTransactions();
      refreshBalance();
    }

    const handleFocus = () => {
      setIsLoading(true);
      fetchTransactions();
      refreshBalance();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, isUserLoading, loadUserProfile]);

  // Update savings balance when total balance changes
  useEffect(() => {
    const savingsAccount = user?.accounts?.find(acc => acc.type === 'savings');
    if (savingsAccount) {
      setSavingsBalance(savingsAccount.balance);
    }
  }, [totalBalance, user?.accounts]);

  // Prepare data for the Pie Chart
  const pieChartData = [
    { name: 'Credit', value: creditTotal }, // Feed calculated credit total
    { name: 'Debit', value: debitTotal },  // Feed calculated debit total
  ];

  const COLORS = ['#82ca9d', '#ff7f50'];

  if (isLoading || isUserLoading) {
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
          icon={<Vault className="h-6 w-6 text-indigo-600" />}
        />
        <DashboardCard
          title="Savings Account"
          value={formatCurrency(totalBalance)}
          subtitle={`Account: ${user?.accounts?.find(acc => acc.type === 'savings')?.account_number}`}
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
                  data={pieChartData} // Use the updated pie chart data
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
          <TransactionList transactions={transactions} />
        </div>
      </div>

      <AddMoneyModal
        isOpen={isAddMoneyModalOpen}
        onClose={() => {
          setIsAddMoneyModalOpen(false);
          refreshBalance();
        }}
        onSuccess={refreshBalance}
      />
    </div>
  );
}
