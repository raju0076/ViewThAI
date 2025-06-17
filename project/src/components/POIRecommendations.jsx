import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { aiService } from '../services/aiService';

function POIRecommendations({ startPoint, endPoint, routeData }) {
  const [pois, setPOIs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: '🌟' },
    { id: 'restaurant', name: 'Food', icon: '🍽️' },
    { id: 'tourist', name: 'Attractions', icon: '🏛️' },
    { id: 'gas', name: 'Gas Stations', icon: '⛽' },
    { id: 'hotel', name: 'Hotels', icon: '🏨' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' }
  ];

  useEffect(() => {
    if (startPoint && endPoint && routeData) {
      fetchPOIs();
    }
  }, [startPoint, endPoint, routeData]);

  const fetchPOIs = async () => {
    if (!startPoint || !endPoint) return;
    
    setIsLoading(true);
    try {
      const recommendedPOIs = await aiService.getRoutePointsOfInterest({
        start: startPoint,
        end: endPoint,
        route: routeData
      });
      setPOIs(recommendedPOIs);
    } catch (error) {
      console.error('Failed to fetch POIs:', error);
      // Fallback to mock data
      setPOIs(generateMockPOIs());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockPOIs = () => {
    return [
      {
        id: '1',
        name: 'Central Park Café',
        category: 'restaurant',
        rating: 4.5,
        description: 'Charming café with outdoor seating and great coffee. Perfect for a mid-journey break.',
        coordinates: { lat: 40.7829, lng: -73.9654 },
        estimatedStopTime: 15,
        aiGenerated: true
      },
      {
        id: '2',
        name: 'Brooklyn Bridge Viewpoint',
        category: 'tourist',
        rating: 4.8,
        description: 'Iconic viewpoint offering stunning views of the Brooklyn Bridge and Manhattan skyline.',
        coordinates: { lat: 40.7061, lng: -73.9969 },
        estimatedStopTime: 20,
        aiGenerated: true
      },
      {
        id: '3',
        name: 'Shell Gas Station',
        category: 'gas',
        rating: 4.0,
        description: 'Convenient gas station with clean facilities and snacks. Strategic stop for refueling.',
        coordinates: { lat: 40.7505, lng: -73.9934 },
        estimatedStopTime: 10,
        aiGenerated: false
      }
    ];
  };

  const filteredPOIs = selectedCategory === 'all' 
    ? pois 
    : pois.filter(poi => poi.category === selectedCategory);

  const getStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={12} className="text-yellow-400" />);
    }
    
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="text-green-500" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Points of Interest</h2>
        </div>
        <button
          onClick={fetchPOIs}
          disabled={isLoading}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          <RefreshCw size={16} className={`text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      {/* POI List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Finding interesting places along your route...</p>
            </div>
          ) : filteredPOIs.length > 0 ? (
            filteredPOIs.map((poi, index) => (
              <motion.div
                key={poi.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{poi.name}</h3>
                      {poi.aiGenerated && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">
                          AI
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        {getStarRating(poi.rating)}
                        <span className="text-sm text-gray-600 ml-1">{poi.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock size={12} />
                        <span className="text-xs">{poi.estimatedStopTime}min stop</span>
                      </div>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-400" />
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{poi.description}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    {poi.coordinates.lat.toFixed(4)}, {poi.coordinates.lng.toFixed(4)}
                  </span>
                  <span className="capitalize">{poi.category}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No points of interest found for the selected category.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default POIRecommendations;