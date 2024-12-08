import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Globe, Users, Car, Calendar, BarChart3, FileText, Settings, Smartphone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import TopNav from '../components/landing/TopNav';
import Hero3D from '../components/landing/Hero3D';
import FeatureCard from '../components/landing/FeatureCard';
import PricingCard from '../components/landing/PricingCard';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TopNav />
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Hero3D />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Images */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800"
                alt="Safari landscape"
                className="w-full h-48 object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800"
                alt="Safari animals"
                className="w-full h-48 object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800"
                alt="Safari vehicle"
                className="w-full h-48 object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800"
                alt="Safari camp"
                className="w-full h-48 object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </motion.div>
          {/* Right side - Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left relative z-10"
          >
            <Map className="w-16 h-16 text-primary mx-auto mb-8" />
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Safari CRM
              <span className="block text-primary">Your Complete Safari Management Solution</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Streamline your safari operations with our comprehensive platform. From lead management to vehicle tracking, everything you need in one place.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <Link
                to="/signup"
                className="px-8 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 font-medium"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Safari Management Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              All the features you need to manage your safari operations efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              icon: Globe,
              title: 'Lead Management',
              description: 'Track leads, manage inquiries, and convert prospects into bookings'
            }, {
              icon: Map,
              title: 'Itinerary Builder',
              description: 'Create custom safari packages with drag-and-drop simplicity'
            }, {
              icon: Users,
              title: 'Guide Management',
              description: 'Manage guides, track certifications, and handle assignments'
            }, {
              icon: Car,
              title: 'Vehicle Fleet',
              description: 'Track vehicle maintenance, fuel, and availability'
            }, {
              icon: Calendar,
              title: 'Task Automation',
              description: 'Automate bookings, reminders, and follow-ups'
            }, {
              icon: BarChart3,
              title: 'Reporting',
              description: 'Get insights with customizable reports and analytics'
            }].map((feature, i) => (
              <FeatureCard
                key={i}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choose the plan that best fits your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Basic',
                price: 49,
                features: [
                  '5 Team Members',
                  'Core CRM Features',
                  'Basic Vehicle Tracking',
                  'Standard Support',
                  '5GB Storage'
                ]
              },
              {
                name: 'Premium',
                price: 99,
                features: [
                  '15 Team Members',
                  'Advanced CRM Features',
                  'Full Fleet Management',
                  'Priority Support',
                  '50GB Storage'
                ]
              },
              {
                name: 'Enterprise',
                price: 199,
                features: [
                  'Unlimited Team Members',
                  'Custom Module Development',
                  'Custom Integrations',
                  'Dedicated Support',
                  'Unlimited Storage'
                ]
              }
            ].map((plan, i) => (
              <PricingCard
                key={plan.name}
                {...plan}
                isPopular={i === 1}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Map className="w-8 h-8 text-primary mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                The most comprehensive safari management platform for tour operators.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">
                    Terms & Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">
                    Knowledge Base
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} Safari CRM • All rights reserved • Made with ❤️ for Safari Operators
          </div>
        </div>
      </footer>
    </div>
  );
}