import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fixes missing marker icon in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow });

function FlyToRider({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 1.5 });
  }, [position, map]);
  return null;
}

export default function CustomerTrackingView({ onLogout }) {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [riderPosition, setRiderPosition] = useState(null);
  const [riderName, setRiderName] = useState('');
  const [connected, setConnected] = useState(false);
  const stompClient = useRef(null);

  useEffect(() => {
    // Load last known location
    fetch(`http://localhost:8080/api/location/${orderId}/track`)
      .then(res => {
        if (!res.ok) throw new Error('Location not found');
        return res.json();
      })
      .then(data => {
        if (data && data.latitude && data.longitude) {
          setRiderPosition([data.latitude, data.longitude]);
          setRiderName(data.riderName || 'Rider');
        }
      })
      .catch((err) => console.log('No previous location found or error fetching.'));

    // Connect WebSocket
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (str) => console.log(str),
      onConnect: () => {
        setConnected(true);

        client.subscribe(`/topic/order${orderId}`, (msg) => {
          try {
            const data = JSON.parse(msg.body);
            setRiderPosition([data.latitude, data.longitude]);
            setRiderName(data.riderName || 'Rider');
          } catch (e) {
            console.error('Error parsing location message', e);
          }
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-indigo-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-md">
              <span className="text-xl">📍</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 leading-tight">Live Tracking</h1>
              <p className="text-sm text-gray-500 font-mono">Order #{orderId}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/my-orders')}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg border border-indigo-100 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-sm"
          >
            ← Back to Orders
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-50">

          {/* Status Bar */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`relative flex h-4 w-4`}>
                {connected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-4 w-4 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              <span className={`font-semibold ${connected ? 'text-green-700' : 'text-red-600'}`}>
                {connected ? 'Live Connection Active' : 'Connecting to tracking server...'}
              </span>
            </div>
            {riderName && (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
                <span className="text-indigo-500">🛵</span>
                <span className="text-sm font-semibold text-indigo-900">Rider: {riderName}</span>
              </div>
            )}
          </div>

          {/* Map Area */}
          <div className="relative h-[600px] w-full bg-gray-100">
            {!riderPosition ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-[400] backdrop-blur-sm">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium text-gray-600">Waiting for rider location...</p>
              </div>
            ) : null}

            <MapContainer
              center={riderPosition || [7.2906, 80.6337]}
              zoom={14}
              style={{ height: '100%', width: '100%', zIndex: 0 }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {riderPosition && (
                <>
                  <FlyToRider position={riderPosition} />
                  <Marker position={riderPosition}>
                    <Popup className="custom-popup">
                      <div className="text-center font-semibold text-indigo-900">
                        🛵 {riderName || 'Rider'}
                      </div>
                    </Popup>
                  </Marker>
                </>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}