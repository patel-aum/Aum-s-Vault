import { CreditCard, Send, Wallet, PiggyBank, Briefcase, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: 'Cards',
    description: 'Manage your credit and debit cards',
    link: '/cards',
    color: 'bg-blue-500',
  },
  {
    icon: <Send className="h-8 w-8" />,
    title: 'Money Transfer',
    description: 'Send money locally and internationally',
    link: '/transfer',
    color: 'bg-green-500',
  },
  {
    icon: <PiggyBank className="h-8 w-8" />,
    title: 'Savings',
    description: 'Grow your wealth with our savings products',
    link: '/savings',
    color: 'bg-purple-500',
  },
  {
    icon: <Briefcase className="h-8 w-8" />,
    title: 'Investments',
    description: 'Explore investment opportunities',
    link: '/investments',
    color: 'bg-orange-500',
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Insurance',
    description: 'Protect what matters most',
    link: '/insurance',
    color: 'bg-red-500',
  },
  {
    icon: <Wallet className="h-8 w-8" />,
    title: 'Loans',
    description: 'Get quick access to funds',
    link: '/loans',
    color: 'bg-indigo-500',
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
        <p className="mt-4 text-gray-600">
          Discover our comprehensive range of financial services designed to meet all your banking needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Link
            key={service.title}
            to={service.link}
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <div className={`${service.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4`}>
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-600">
              {service.title}
            </h3>
            <p className="text-gray-600">{service.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}