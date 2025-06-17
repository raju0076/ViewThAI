import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Leaf, Eye, Shield, Clock, TrendingUp } from 'lucide-react';

function RouteOptimizer({ routeType, setRouteType, aiAnalysis }) {
  const routeOptions = [
    {
      id: 'fastest',
      name: 'Fastest',
      icon: Zap,
      color: 'from-red-500 to-orange-500',
      description: 'Minimize travel time',
      aiScore: aiAnalysis?.routeScores?.fastest || 0
    },
    {
      id: 'scenic',
      name: 'Scenic',
      icon: Eye,
      color: 'from-green-500 to-emerald-500',
      description: 'Beautiful views and landmarks',
      aiScore: aiAnalysis?.routeScores?.scenic || 0
    },
    {
      id: 'eco',
      name: 'Eco-Friendly',
      icon: Leaf,
      color: 'from-green-400 to-teal-500',
      description: 'Lower carbon footprint',
      aiScore: aiAnalysis?.routeScores?.eco || 0
    },
    {
      id: 'safest',
      name: 'Safest',
      icon: Shield,
      color: 'from-blue-500 to-indigo-500',
      description: 'Avoid high-risk areas',
      aiScore: aiAnalysis?.routeScores?.safest || 0
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="text-indigo-500" size={24} />
        <h2 className="text-xl font-bold text-gray-900">Route Optimization</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {routeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = routeType === option.id;
          
          return (
            <motion.button
              key={option.id}
              onClick={() => setRouteType(option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                  <Icon size={16} className="text-white" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">{option.name}</span>
              </div>
              
              <p className="text-xs text-gray-600 text-left mb-3">{option.description}</p>
              
              {option.aiScore > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">AI Score</span>
                    <span className="font-medium">{Math.round(option.aiScore)}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${option.aiScore}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-1.5 rounded-full bg-gradient-to-r ${option.color}`}
                    />
                  </div>
                </div>
              )}
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {aiAnalysis?.recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200"
        >
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">AI</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">AI Recommendation</h4>
              <p className="text-sm text-gray-700 mt-1">{aiAnalysis.recommendation}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default RouteOptimizer;