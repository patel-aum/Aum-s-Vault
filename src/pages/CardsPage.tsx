import { useState } from 'react';
import { CreditCard, Plus, Eye, EyeOff } from 'lucide-react';
import { formatAccountNumber } from '../lib/utils';

interface Card {
  id: string;
  type: 'credit' | 'debit';
  number: string;
  expiryDate: string;
  name: string;
  balance?: number;
  limit?: number;
}

const mockCards: Card[] = [
  {
    id: '1',
    type: 'credit',
    number: '4532 **** **** 7895',
    expiryDate: '12/25',
    name: 'John Doe',
    balance: 2500,
    limit: 10000,
  },
  {
    id: '2',
    type: 'debit',
    number: '5248 **** **** 1234',
    expiryDate: '09/26',
    name: 'John Doe',
    balance: 5400,
  },
];

export default function CardsPage() {
  const [showCardDetails, setShowCardDetails] = useState<Record<string, boolean>>({});

  const toggleCardDetails = (cardId: string) => {
    setShowCardDetails(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Cards</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCards.map((card) => (
          <div key={card.id} className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl text-white">
            <div className="flex justify-between items-start mb-8">
              <CreditCard className="h-10 w-10" />
              <span className="text-sm font-medium uppercase">
                {card.type === 'credit' ? 'Credit Card' : 'Debit Card'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Card Number</span>
                <button
                  onClick={() => toggleCardDetails(card.id)}
                  className="text-white/80 hover:text-white"
                >
                  {showCardDetails[card.id] ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xl font-medium tracking-wider">
                {showCardDetails[card.id] ? card.number : '•••• •••• •••• ' + card.number.slice(-4)}
              </p>

              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Card Holder</p>
                  <p className="font-medium">{card.name}</p>
                </div>
                <div>
                  <p className="text-sm">Expires</p>
                  <p className="font-medium">{card.expiryDate}</p>
                </div>
              </div>

              {card.type === 'credit' && (
                <div className="pt-4 border-t border-white/20">
                  <div className="flex justify-between text-sm">
                    <span>Available Credit</span>
                    <span>{formatAccountNumber(String(card.limit! - card.balance!))}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Credit Limit</span>
                    <span>{formatAccountNumber(String(card.limit!))}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        {/* Transaction list component can be added here */}
      </div>
    </div>
  );
}