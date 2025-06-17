import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Polyline } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import SignOutButton from "./SignOutButton";
import AIRouteAnalysis from "./AIRouteAnalysis";
import POIRecommendations from "./POIRecommendations";
import SmartSearch from "./SmartSearch";
import WeatherIntegration from "./WeatherIntegration";
import RouteOptimizer from "./RouteOptimizer";
import { aiService } from "../services/aiService";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

function RoutingMachine({ startPoint, endPoint, setDistance, routeType, onRouteCalculated }) {
  const map = useMap();

  useEffect(() => {
    if (!startPoint || !endPoint) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(startPoint.lat, startPoint.lng),
        L.latLng(endPoint.lat, endPoint.lng)
      ],
      routeWhileDragging: true,
      show: false,
      addWaypoints: false,
      createMarker: () => null, // We handle markers separately
    }).addTo(map);

    routingControl.on("routesfound", function (e) {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const route = routes[0];
        const distanceInKm = route.summary.totalDistance / 1000;
        const timeInMinutes = route.summary.totalTime / 60;

        setDistance(distanceInKm.toFixed(2));

        // Pass coordinates for drawing the polyline
        const coordinates = route.coordinates.map(coord => [coord.lat, coord.lng]);

        onRouteCalculated({
          distance: distanceInKm,
          time: timeInMinutes,
          coordinates: coordinates, // Use the mapped coordinates here
          waypoints: route.waypoints,
        });
      }
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [startPoint, endPoint, map, setDistance, routeType, onRouteCalculated]);

  return null;
}

// New component to draw the route polyline
function RoutePolyline({ pathCoordinates }) {
  if (!pathCoordinates || pathCoordinates.length === 0) {
    return null;
  }
  return <Polyline positions={pathCoordinates} color="red" weight={5} />;
}

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
}

function MapPage({ setIsAuthenticated }) {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [distance, setDistance] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [routeType, setRouteType] = useState("fastest");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAIPanel, setActiveAIPanel] = useState(null);

  const handleMapClick = (latlng) => {
    if (!startPoint) {
      setStartPoint({ lat: latlng.lat, lng: latlng.lng });
    } else if (!endPoint) {
      setEndPoint({ lat: latlng.lat, lng: latlng.lng });
    }
  };

  const handleRouteCalculated = async (route) => {
    setRouteData(route);
    if (startPoint && endPoint) {
      setIsAnalyzing(true);
      try {
        const analysis = await aiService.analyzeRoute({
          start: startPoint,
          end: endPoint,
          route: route,
          routeType: routeType
        });
        setAiAnalysis(analysis);
      } catch (error) {
        console.error("AI analysis failed:", error);
        toast.error("AI analysis temporarily unavailable");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const resetPoints = () => {
    setStartPoint(null);
    setEndPoint(null);
    setDistance(null);
    setRouteData(null);
    setAiAnalysis(null);
    setActiveAIPanel(null);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStartPoint({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error obtaining geolocation: ", error);
          toast.error("Unable to retrieve your current location. Please try again.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-2xl">
        <div className="px-8 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Route Planner</h1>
              <p className="text-blue-100 text-sm">Intelligent navigation powered by AI</p>
            </div>
          </div>
          <SignOutButton setIsAuthenticated={setIsAuthenticated} />
        </div>
      </header>

      <main className="flex flex-col lg:flex-row p-6 gap-6">
        {/* Left Sidebar */}
        <aside className="lg:w-96 space-y-6">
          {/* Smart Search */}
          <SmartSearch
            startPoint={startPoint}
            endPoint={endPoint}
            setStartPoint={setStartPoint}
            setEndPoint={setEndPoint}
            onUseCurrentLocation={handleUseCurrentLocation}
          />

          {/* Route Optimizer */}
          <RouteOptimizer
            routeType={routeType}
            setRouteType={setRouteType}
            aiAnalysis={aiAnalysis}
          />

          {/* AI Analysis Panel */}
          {(routeData || isAnalyzing) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <AIRouteAnalysis
                routeData={routeData}
                aiAnalysis={aiAnalysis}
                isAnalyzing={isAnalyzing}
                distance={distance}
              />
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={resetPoints}
              className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Reset Route
            </button>
          </div>
        </aside>

        {/* Map and AI Panels */}
        <div className="flex-1 space-y-6">
          {/* Map Container */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              className="h-[60vh] lg:h-[70vh] w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {startPoint && <Marker position={[startPoint.lat, startPoint.lng]} />}
              {endPoint && <Marker position={[endPoint.lat, endPoint.lng]} />}
              <ClickHandler onMapClick={handleMapClick} />
              {startPoint && endPoint && (
                <RoutingMachine
                  startPoint={startPoint}
                  endPoint={endPoint}
                  setDistance={setDistance}
                  routeType={routeType}
                  onRouteCalculated={handleRouteCalculated}
                />
              )}
              {routeData && routeData.coordinates && (
                <RoutePolyline pathCoordinates={routeData.coordinates} />
              )}
            </MapContainer>
          </div>

          {/* AI Feature Panels */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* POI Recommendations */}
            {routeData && (
              <POIRecommendations
                startPoint={startPoint}
                endPoint={endPoint}
                routeData={routeData}
              />
            )}

            {/* Weather Integration */}
            {routeData && (
              <WeatherIntegration
                startPoint={startPoint}
                endPoint={endPoint}
                routeData={routeData}
              />
            )}
          </div>
        </div>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default MapPage;