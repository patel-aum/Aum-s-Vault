import { ArrowRight, Shield, Zap, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to <span className="text-indigo-600">Vaultify</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience banking reimagined with cutting-edge security and seamless transactions
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/login"
            className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
          <Shield className="h-12 w-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Banking</h3>
          <p className="text-gray-600">
            State-of-the-art security measures to protect your financial data
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
          <Zap className="h-12 w-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Instant Transfers</h3>
          <p className="text-gray-600">
            Lightning-fast money transfers to any account worldwide
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
          <RefreshCcw className="h-12 w-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">24/7 Banking</h3>
          <p className="text-gray-600">
            Access your account and make transactions anytime, anywhere
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white p-12 rounded-2xl text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="mb-8 text-indigo-100">
          Join thousands of satisfied customers who trust Vaultify
        </p>
        <Link
          to="/signup"
          className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 inline-flex items-center gap-2"
        >
          Open an Account <ArrowRight className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
}