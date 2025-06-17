import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer, AlertTriangle } from 'lucide-react';
import { aiService } from '../services/aiService';

function WeatherIntegration({ startPoint, endPoint, routeData }) {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (startPoint && endPoint && routeData) {
      fetchWeatherData();
    }
  }, [startPoint, endPoint, routeData]);

  const fetchWeatherData = async () => {
    if (!startPoint || !endPoint) return;
    
    setIsLoading(true);
    try {
      const weather = await aiService.getRouteWeatherAnalysis({
        start: startPoint,
        end: endPoint,
        route: routeData
      });
      setWeatherData(weather);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      // Fallback to mock data
      setWeatherData(generateMockWeatherData());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockWeatherData = () => {
    return {
      current: {
        temperature: 22,
        condition: 'partly-cloudy',
        humidity: 65,
        windSpeed: 15,
        description: 'Partly cloudy with light winds'
      },
      forecast: [
        {
          time: '12:00',
          temperature: 24,
          condition: 'sunny',
          precipitation: 0
        },
        {
          time: '15:00',
          temperature: 26,
          condition: 'partly-cloudy',
          precipitation: 10
        },
        {
          time: '18:00',
          temperature: 23,
          condition: 'cloudy',
          precipitation: 20
        }
      ],
      alerts: [
        {
          type: 'info',
          message: 'Light rain expected around 3 PM. Consider bringing an umbrella.'
        }
      ],
      recommendation: 'Good conditions for travel. Slight chance of rain in the afternoon.',
      impactOnRoute: 'Minimal weather impact expected. Roads should remain clear.'
    };
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="text-yellow-500" size={20} />;
      case 'partly-cloudy':
        return <Cloud className="text-gray-500" size={20} />;
      case 'cloudy':
        return <Cloud className="text-gray-600" size={20} />;
      case 'rainy':
        return <CloudRain className="text-blue-500" size={20} />;
      case 'snowy':
        return <Snowflake className="text-blue-300" size={20} />;
      default:
        return <Sun className="text-yellow-500" size={20} />;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="text-red-500" size={16} />;
      case 'info':
        return <Cloud className="text-blue-500" size={16} />;
      default:
        return <Cloud className="text-blue-500" size={16} />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return 'from-red-50 to-orange-50 border-red-200';
      case 'info':
        return 'from-blue-50 to-cyan-50 border-blue-200';
      default:
        return 'from-blue-50 to-cyan-50 border-blue-200';
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing weather conditions...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Cloud className="text-blue-500" size={24} />
        <h2 className="text-xl font-bold text-gray-900">Weather Insights</h2>
      </div>

      {weatherData && (
        <div className="space-y-6">
          {/* Current Weather */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Current Conditions</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getWeatherIcon(weatherData.current.condition)}
                <div>
                  <div className="flex items-center space-x-2">
                    <Thermometer size={16} className="text-red-500" />
                    <span className="text-2xl font-bold text-gray-900">
                      {weatherData.current.temperature}°C
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{weatherData.current.description}</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div className="flex items-center space-x-1 mb-1">
                  <Wind size={12} />
                  <span>{weatherData.current.windSpeed} km/h</span>
                </div>
                <div>💧 {weatherData.current.humidity}%</div>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Route Forecast</h3>
            <div className="grid grid-cols-3 gap-3">
              {weatherData.forecast.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-sm font-medium text-gray-900 mb-2">{item.time}</div>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(item.condition)}
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {item.temperature}°
                  </div>
                  <div className="text-xs text-blue-600">
                    {item.precipitation}% rain
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Alerts */}
          {weatherData.alerts && weatherData.alerts.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Weather Alerts</h3>
              {weatherData.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-r ${getAlertColor(alert.type)} rounded-lg p-3 border`}
                >
                  <div className="flex items-start space-x-2">
                    {getAlertIcon(alert.type)}
                    <p className="text-sm text-gray-700 flex-1">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Recommendation */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">AI</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Weather Recommendation</h4>
                <p className="text-sm text-gray-700 mb-2">{weatherData.recommendation}</p>
                <p className="text-xs text-gray-600">{weatherData.impactOnRoute}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default WeatherIntegration;