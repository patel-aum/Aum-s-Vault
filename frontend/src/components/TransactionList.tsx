import { formatCurrency } from '../lib/utils';

interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  created_at?: string;
  from_account_number?: string;
  to_account_number?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return new Date().toLocaleDateString();
    }
    return new Date(dateString).toLocaleDateString();
  };

  const getTransactionType = (type: string, fromAccountNumber?: string, currentUserAccountNumber?: string) => {
    if (fromAccountNumber === currentUserAccountNumber) {
      return 'debit';
    }
    return 'credit';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {transactions.length === 0 ? (
          <div className="px-6 py-4 text-center text-gray-500">
            No transactions found
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="px-6 py-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{transaction.description || 'No description provided'}</p>
                {transaction.from_account_number && transaction.to_account_number && (
                  <p className="text-sm text-gray-500">
                    {transaction.from_account_number} → {transaction.to_account_number}
                  </p>
                )}
                <p className="text-sm text-gray-500">{formatDate(transaction.created_at)}</p>
              </div>
              <span className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'credit' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}