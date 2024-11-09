import { useState, useEffect } from 'react';
import { CreditCard, Plus, Eye, EyeOff } from 'lucide-react';
import { formatAccountNumber } from '../lib/utils';
import { cards, users } from '../lib/api'; 

interface Card {
  id: string;
  type: 'credit' | 'debit';
  number: string;
  expiryDate: string;
  name: string; 
  balance?: number;
  limit?: number;
} 

export default function CardsPage() {
  const [cardsList, setCardsList] = useState<Card[]>([]);
  const [showCardDetails, setShowCardDetails] = useState<Record<string, boolean>>({});

  // Fetching cards from card service
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const fetchedCards = await cards.getAll(); // Fetch cards from the API
        const mappedCards = await Promise.all(fetchedCards.map(async (card: any) => {
          const userDetails = await users.getProfile(card.user_id); // Fetch user details for each card

          return {
            id: card.id.toString(), 
            type: card.card_type === 'credit' ? 'credit' : 'debit', 
            number: card.card_number,
            expiryDate: new Date(card.expiry_date).toLocaleDateString(), // Format expiry date
            name: userDetails.name,  // Get name from user details
            balance: 0, // Placeholder balance, adjust as needed
            limit: card.card_type === 'credit' ? 10000 : undefined, // Placeholder limit for credit cards
          };
        }));
        
        setCardsList(mappedCards); // Set the mapped cards with user info
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

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
        {cardsList.map((card) => (
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
