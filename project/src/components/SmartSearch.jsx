import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Navigation, Sparkles } from 'lucide-react';
import { aiService } from '../services/aiService';

function SmartSearch({ 
  startPoint, 
  endPoint, 
  setStartPoint, 
  setEndPoint, 
  onUseCurrentLocation 
}) {
  const [searchStart, setSearchStart] = useState("");
  const [searchEnd, setSearchEnd] = useState("");
  const [suggestionsStart, setSuggestionsStart] = useState([]);
  const [suggestionsEnd, setSuggestionsEnd] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchSmartSuggestions = async (query) => {
    try {
      setIsSearching(true);
      
      // First try AI-enhanced search
      const aiEnhanced = await aiService.enhanceLocationSearch(query);
      
      // Then fetch from Nominatim with enhanced query
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(aiEnhanced.enhancedQuery)}&limit=8&extratags=1&addressdetails=1`
      );
      const data = await response.json();
      
      // Enhance results with AI scoring
      const enhancedResults = data.map((item, index) => ({
        ...item,
        category: aiEnhanced.detectedCategory,
        confidence: Math.max(0.6, 1 - (index * 0.1)) // Higher confidence for top results
      }));

      return enhancedResults;
    } catch (error) {
      console.error("Smart search failed:", error);
      // Fallback to regular search
      return await fetchRegularSuggestions(query);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchRegularSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching suggestions: ", error);
      return [];
    }
  };

  const handleStartInputChange = async (e) => {
    const query = e.target.value;
    setSearchStart(query);
    if (query.length > 2) {
      const suggestions = await fetchSmartSuggestions(query);
      setSuggestionsStart(suggestions);
    } else {
      setSuggestionsStart([]);
    }
  };

  const handleEndInputChange = async (e) => {
    const query = e.target.value;
    setSearchEnd(query);
    if (query.length > 2) {
      const suggestions = await fetchSmartSuggestions(query);
      setSuggestionsEnd(suggestions);
    } else {
      setSuggestionsEnd([]);
    }
  };

  const handleSelectStartSuggestion = (suggestion) => {
    setSearchStart(suggestion.display_name);
    setStartPoint({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
    setSuggestionsStart([]);
  };

  const handleSelectEndSuggestion = (suggestion) => {
    setSearchEnd(suggestion.display_name);
    setEndPoint({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
    setSuggestionsEnd([]);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'restaurant': return '🍽️';
      case 'hotel': return '🏨';
      case 'tourist': return '🏛️';
      case 'shopping': return '🛍️';
      case 'transport': return '🚇';
      default: return '📍';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="text-purple-500" size={24} />
        <h2 className="text-xl font-bold text-gray-900">Smart Location Search</h2>
      </div>

      <div className="space-y-6">
        {/* Start Point Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin size={16} className="inline mr-1" />
            Start Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchStart}
              onChange={handleStartInputChange}
              className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              placeholder="Try: 'coffee shop near Times Square' or 'JFK Airport'"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            {isSearching && (
              <div className="absolute right-3 top-3.5">
                <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          <div className="flex mt-3 space-x-2">
            <button
              onClick={onUseCurrentLocation}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium"
            >
              <Navigation size={16} />
              <span>My Location</span>
            </button>
          </div>

          {suggestionsStart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 border border-gray-200 rounded-xl bg-white shadow-lg max-h-60 overflow-y-auto"
            >
              {suggestionsStart.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                  onClick={() => handleSelectStartSuggestion(suggestion)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.display_name}
                      </p>
                      {suggestion.confidence && (
                        <div className="flex items-center mt-1">
                          <div className="w-12 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${suggestion.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {Math.round(suggestion.confidence * 100)}% match
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* End Point Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin size={16} className="inline mr-1" />
            Destination
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchEnd}
              onChange={handleEndInputChange}
              className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              placeholder="Try: 'best pizza in Brooklyn' or 'Central Park'"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            {isSearching && (
              <div className="absolute right-3 top-3.5">
                <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {suggestionsEnd.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 border border-gray-200 rounded-xl bg-white shadow-lg max-h-60 overflow-y-auto"
            >
              {suggestionsEnd.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                  onClick={() => handleSelectEndSuggestion(suggestion)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.display_name}
                      </p>
                      {suggestion.confidence && (
                        <div className="flex items-center mt-1">
                          <div className="w-12 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${suggestion.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {Math.round(suggestion.confidence * 100)}% match
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Current Points Display */}
        {(startPoint || endPoint) && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {startPoint && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Start: {startPoint.lat.toFixed(4)}, {startPoint.lng.toFixed(4)}</span>
              </div>
            )}
            {endPoint && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>End: {endPoint.lat.toFixed(4)}, {endPoint.lng.toFixed(4)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default SmartSearch;