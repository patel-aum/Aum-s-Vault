import { Wallet } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="h-6 w-6" />
              <span className="text-lg font-bold">Aum's Vault</span>
            </div>
            <p className="mt-2 text-gray-400">
              Secure banking solutions for a better tomorrow
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="/careers" className="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="/blog" className="text-gray-400 hover:text-white">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="/services" className="text-gray-400 hover:text-white">Banking</a></li>
              <li><a href="/cards" className="text-gray-400 hover:text-white">Cards</a></li>
              <li><a href="/loans" className="text-gray-400 hover:text-white">Loans</a></li>
              <li><a href="/investments" className="text-gray-400 hover:text-white">Investments</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>1234 Banking Street</li>
              <li>Financial District</li>
              <li>support@aumsvault.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Aum's Vault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}