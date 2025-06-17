import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, Route, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

function AIRouteAnalysis({ routeData, aiAnalysis, isAnalyzing, distance }) {
  if (isAnalyzing) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
            <Brain className="text-white animate-pulse" size={24} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analyzing Route...</h3>
        <p className="text-gray-600 text-sm">Processing traffic, weather, and optimal path</p>
      </div>
    );
  }

  if (!routeData && !aiAnalysis) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Route className="text-gray-400" size={24} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Route Analysis</h3>
        <p className="text-gray-600 text-sm">Select start and end points to get AI-powered insights</p>
      </div>
    );
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="text-purple-500" size={24} />
        <h2 className="text-xl font-bold text-gray-900">AI Route Analysis</h2>
      </div>

      {/* Basic Route Info */}
      {routeData && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Route className="text-blue-500" size={20} />
              <span className="font-semibold text-gray-900">Distance</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{distance} km</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="text-green-500" size={20} />
              <span className="font-semibold text-gray-900">Est. Time</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatTime(routeData.time)}</p>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {aiAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Route Scores */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <TrendingUp size={18} className="mr-2 text-indigo-500" />
              Route Quality Scores
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Safety</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(aiAnalysis.safetyScore)}`}>
                  {aiAnalysis.safetyScore}/100
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Scenic</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(aiAnalysis.scenicScore)}`}>
                  {aiAnalysis.scenicScore}/100
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Traffic</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(aiAnalysis.trafficScore)}`}>
                  {aiAnalysis.trafficScore}/100
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Eco-Friendly</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(aiAnalysis.ecoScore)}`}>
                  {aiAnalysis.ecoScore}/100
                </span>
              </div>
            </div>
          </div>

          {/* Traffic Prediction */}
          {aiAnalysis.trafficPrediction && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <AlertTriangle size={18} className="mr-2 text-orange-500" />
                Traffic Insights
              </h3>
              <p className="text-sm text-gray-700">{aiAnalysis.trafficPrediction}</p>
            </div>
          )}

          {/* Best Departure Times */}
          {aiAnalysis.bestDepartureTimes && aiAnalysis.bestDepartureTimes.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle size={18} className="mr-2 text-green-500" />
                Optimal Departure Times
              </h3>
              <div className="space-y-2">
                {aiAnalysis.bestDepartureTimes.map((time, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{time.time}</span>
                    <span className="text-green-600 font-medium">{time.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Routes */}
          {aiAnalysis.alternativeRoutes && aiAnalysis.alternativeRoutes.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Alternative Routes</h3>
              <div className="space-y-2">
                {aiAnalysis.alternativeRoutes.map((route, index) => (
                  <div key={index} className="border border-purple-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-gray-900">{route.name}</span>
                      <span className="text-sm text-purple-600">+{route.extraTime}min</span>
                    </div>
                    <p className="text-sm text-gray-600">{route.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default AIRouteAnalysis;