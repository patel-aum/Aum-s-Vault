import { useState, useEffect } from 'react';
import {
  Users,
  CreditCard,
  ArrowUpDown,
  Activity,
  AlertTriangle,
  Search,
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { formatCurrency } from '../lib/utils';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [activeCards, setActiveCards] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, transactionsRes, cardsRes, recentTransRes] = await Promise.all([
          fetch('/api/admin/total-users'),
          fetch('/api/admin/total-transactions'),
          fetch('/api/admin/active-cards'),
          fetch('/api/admin/recent-transactions')
        ]);

        const usersData = await usersRes.json();
        const transactionsData = await transactionsRes.json();
        const cardsData = await cardsRes.json();
        const recentTransData = await recentTransRes.json();

        setTotalUsers(usersData.total);
        setTotalTransactions(transactionsData.total);
        setActiveCards(cardsData.total);
        setRecentTransactions(recentTransData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="h-6 w-6 text-indigo-600" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <DashboardCard
          title="Total Transactions"
          value={formatCurrency(totalTransactions)}
          icon={<ArrowUpDown className="h-6 w-6 text-indigo-600" />}
          trend={{ value: 8.2, isPositive: true }}
        />
        <DashboardCard
          title="Active Cards"
          value={activeCards}
          icon={<CreditCard className="h-6 w-6 text-indigo-600" />}
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions
                .filter((transaction) =>
                  transaction.user.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{transaction.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{transaction.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(transaction.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
