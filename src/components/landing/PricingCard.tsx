import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingCardProps {
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  delay?: number;
}

export default function PricingCard({ name, price, features, isPopular, delay = 0 }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`relative bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${
        isPopular ? 'ring-2 ring-primary' : ''
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-black text-sm font-medium rounded-full">
          Most Popular
        </span>
      )}

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {name}
      </h3>
      <div className="text-3xl font-bold text-gray-900 mb-6">
        ${price}
        <span className="text-base font-normal text-gray-500">
          /month
        </span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <CheckCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/signup"
        className={`block w-full px-6 py-3 text-center rounded-lg transition-colors font-medium ${
          isPopular
            ? 'bg-primary text-black hover:bg-primary/90'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        Get Started
      </Link>
    </motion.div>
  );
}