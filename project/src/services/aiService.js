class AIService {
  delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  async enhanceLocationSearch(query) {
    // Simulate AI processing delay
    await this.delay(500);

    // Detect search intent and category
    const categories = {
      'coffee': 'restaurant',
      'restaurant': 'restaurant',
      'food': 'restaurant',
      'hotel': 'hotel',
      'gas': 'gas',
      'hospital': 'medical',
      'airport': 'transport',
      'mall': 'shopping',
      'park': 'tourist',
      'museum': 'tourist'
    };

    let detectedCategory = 'general';
    let enhancedQuery = query;

    // Simple keyword detection
    for (const [keyword, category] of Object.entries(categories)) {
      if (query.toLowerCase().includes(keyword)) {
        detectedCategory = category;
        break;
      }
    }

    // Enhance query with location context
    if (query.toLowerCase().includes('near') || query.toLowerCase().includes('close to')) {
      enhancedQuery = query; // Keep natural language
    } else if (detectedCategory !== 'general') {
      enhancedQuery = `${query} popular rated`;
    }

    return {
      enhancedQuery,
      detectedCategory,
      confidence: 0.8
    };
  }

  async analyzeRoute(params) {
    // Simulate AI processing
    await this.delay(2000);

    const { route, routeType } = params;
    const distance = route.distance;
    const time = route.time;

    // Generate realistic scores based on route characteristics
    const safetyScore = Math.min(95, Math.max(60, 85 - (distance / 100) * 5));
    const scenicScore = Math.min(90, Math.max(40, 70 + Math.random() * 20));
    const trafficScore = Math.min(95, Math.max(30, 80 - (time / distance) * 10));
    const ecoScore = Math.min(90, Math.max(50, 75 - (distance / 50) * 5));

    // Generate route type scores
    const routeScores = {
      fastest: trafficScore,
      scenic: scenicScore,
      eco: ecoScore,
      safest: safetyScore
    };

    // Generate traffic prediction
    const hour = new Date().getHours();
    let trafficPrediction = "Light traffic expected throughout the journey.";
    if (hour >= 7 && hour <= 9) {
      trafficPrediction = "Heavy morning traffic expected. Consider departing after 10 AM.";
    } else if (hour >= 17 && hour <= 19) {
      trafficPrediction = "Evening rush hour traffic. Expect delays of 15-30 minutes.";
    }

    // Generate departure time suggestions
    const bestDepartureTimes = [
      { time: "10:30 AM", reason: "Avoid morning traffic" },
      { time: "2:00 PM", reason: "Optimal conditions" },
      { time: "7:30 PM", reason: "Post-rush hour" }
    ];

    // Generate alternative routes
    const alternativeRoutes = [
      {
        name: "Scenic Route",
        description: "Takes you through beautiful countryside areas",
        extraTime: 15,
        benefits: ["Better views", "Less traffic"]
      },
      {
        name: "Express Route",
        description: "Uses highways for fastest travel time",
        extraTime: -5,
        benefits: ["Fastest option", "Good road conditions"]
      }
    ];

    // Generate AI recommendation
    let recommendation = `Based on current conditions, the ${routeType} route is optimal. `;
    if (trafficScore < 60) {
      recommendation += "Consider departing at a different time to avoid heavy traffic.";
    } else if (scenicScore > 80) {
      recommendation += "This route offers excellent scenic views!";
    } else {
      recommendation += "Good balance of time and road conditions.";
    }

    return {
      safetyScore: Math.round(safetyScore),
      scenicScore: Math.round(scenicScore),
      trafficScore: Math.round(trafficScore),
      ecoScore: Math.round(ecoScore),
      routeScores,
      trafficPrediction,
      bestDepartureTimes,
      alternativeRoutes,
      recommendation
    };
  }

  async getRoutePointsOfInterest(params) {
    // Simulate API delay
    await this.delay(1500);

    // Generate POIs along the route
    const pois = [
      {
        id: '1',
        name: 'Mountain View Café',
        category: 'restaurant',
        rating: 4.6,
        description: 'Cozy café with panoramic mountain views and locally sourced ingredients. Perfect for a refreshing break with artisanal coffee and homemade pastries.',
        coordinates: {
          lat: params.start.lat + (params.end.lat - params.start.lat) * 0.3,
          lng: params.start.lng + (params.end.lng - params.start.lng) * 0.3
        },
        estimatedStopTime: 20,
        aiGenerated: true
      },
      {
        id: '2',
        name: 'Historic Landmark Museum',
        category: 'tourist',
        rating: 4.8,
        description: 'Fascinating museum showcasing local history and culture. Features interactive exhibits and guided tours. A must-visit cultural stop.',
        coordinates: {
          lat: params.start.lat + (params.end.lat - params.start.lat) * 0.6,
          lng: params.start.lng + (params.end.lng - params.start.lng) * 0.6
        },
        estimatedStopTime: 45,
        aiGenerated: true
      },
      {
        id: '3',
        name: 'EcoFuel Station',
        category: 'gas',
        rating: 4.2,
        description: 'Modern gas station with electric charging points, clean restrooms, and a convenience store. Eco-friendly fuel options available.',
        coordinates: {
          lat: params.start.lat + (params.end.lat - params.start.lat) * 0.5,
          lng: params.start.lng + (params.end.lng - params.start.lng) * 0.5
        },
        estimatedStopTime: 10,
        aiGenerated: false
      },
      {
        id: '4',
        name: 'Riverside Park',
        category: 'tourist',
        rating: 4.4,
        description: 'Beautiful park along the river with walking trails, picnic areas, and scenic viewpoints. Great for stretching your legs and enjoying nature.',
        coordinates: {
          lat: params.start.lat + (params.end.lat - params.start.lat) * 0.8,
          lng: params.start.lng + (params.end.lng - params.start.lng) * 0.8
        },
        estimatedStopTime: 30,
        aiGenerated: true
      }
    ];

    return pois;
  }

  async getRouteWeatherAnalysis(params) {
    // Simulate API delay
    await this.delay(1000);

    const currentHour = new Date().getHours();
    
    // Generate realistic weather based on time of day
    const temperatures = [18, 22, 25, 23]; // Sample temperatures
    const conditions = ['sunny', 'partly-cloudy', 'cloudy', 'partly-cloudy'];
    const precipitationChances = [0, 10, 30, 15];

    const forecast = [];
    for (let i = 0; i < 3; i++) {
      const hour = (currentHour + i * 3) % 24;
      forecast.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        temperature: temperatures[i] || 20,
        condition: conditions[i] || 'sunny',
        precipitation: precipitationChances[i] || 5
      });
    }

    // Generate weather alerts based on conditions
    const alerts = [];
    if (precipitationChances.some(chance => chance > 20)) {
      alerts.push({
        type: 'info',
        message: 'Light rain expected during your journey. Consider bringing an umbrella and driving cautiously.'
      });
    }

    if (temperatures.some(temp => temp > 30)) {
      alerts.push({
        type: 'warning',
        message: 'High temperatures expected. Stay hydrated and ensure your vehicle is well-maintained.'
      });
    }

    return {
      current: {
        temperature: temperatures[0],
        condition: conditions[0],
        humidity: 65,
        windSpeed: 12,
        description: 'Pleasant conditions with light breeze'
      },
      forecast,
      alerts,
      recommendation: 'Good weather conditions for travel. Pack light rain gear as a precaution.',
      impactOnRoute: 'Weather should have minimal impact on your journey. Road conditions expected to remain good.'
    };
  }
}

export const aiService = new AIService();