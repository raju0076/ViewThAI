import React from 'react';
import { motion } from 'framer-motion';

function LoginPage({ setIsAuthenticated }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Route Planner</h1>
          <p className="text-gray-600">Sign in to access intelligent navigation</p>
        </div>

        <button
          onClick={() => setIsAuthenticated(true)}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Sign In (Demo)
        </button>
      </motion.div>
    </div>
  );
}

export default LoginPage;