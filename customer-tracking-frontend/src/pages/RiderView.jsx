import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function RiderView() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const stompClient = useRef(null);
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState('Ready to broadcast');
  const watchId = useRef(null);

  // In a real app, riderName would come from the logged-in user context
  const riderName = "Delivery Partner"; 

  const startTracking = () => {
    setStatus('Connecting...');
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        setStatus('Connected! Sharing live location.');
        setTracking(true);

        // Watch GPS position and send every update
        watchId.current = navigator.geolocation.watchPosition(
          (pos) => {
            client.publish({
              destination: '/app/order/update-location',
              body: JSON.stringify({
                orderId,
                riderName,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              }),
            });
          },
          (err) => {
            console.error(err);
            setStatus('GPS Error: ' + err.message);
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      },
      onDisconnect: () => {
        setStatus('Disconnected.');
        setTracking(false);
      },
      onStompError: (err) => {
        setStatus('Broker error.');
        console.error(err);
      }
    });

    client.activate();
    stompClient.current = client;
  };

  const stopTracking = () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
    }
    if (stompClient.current) {
      stompClient.current.deactivate();
    }
    setTracking(false);
    setStatus('Tracking stopped.');
  };

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []); // cleanup

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4 shadow-inner">
            <span className="text-4xl">🛵</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Rider Portal</h2>
          <p className="text-blue-100 mt-1 font-mono text-sm">Order ID: #{orderId}</p>
        </div>

        <div className="p-8 space-y-8">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Connection Status</h3>
            <div className="flex items-center gap-3">
              <span className={`relative flex h-3 w-3`}>
                {tracking && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${tracking ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              </span>
              <span className={`font-medium ${tracking ? 'text-green-700' : 'text-gray-600'}`}>{status}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {!tracking ? (
              <button 
                onClick={startTracking}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 flex justify-center items-center gap-2"
              >
                <span>▶</span> Start Sharing Location
              </button>
            ) : (
              <button 
                onClick={stopTracking}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all duration-200 flex justify-center items-center gap-2"
              >
                <span>⏹</span> Stop Sharing Location
              </button>
            )}

            <button 
              onClick={() => navigate('/deliver-dashboard')}
              className="w-full py-3 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 active:scale-95 font-semibold rounded-xl transition-all duration-200"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}