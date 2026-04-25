import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fixes missing marker icon in React
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow });

// Handles map click → sets marker position
function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng); // { lat, lng }
    }
  });
  return null;
}

export default function MapView() {
  const [position, setPosition] = useState(null); // { lat, lng }
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    if (!position || !name) {
      setStatus('Please click a location on the map and enter a name.');
      return;
    }

    const payload = {
      name: name,
      latitude: position.lat,
      longitude: position.lng,
    };

    try {
      const res = await fetch('http://localhost:8080/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus('✅ Location saved!');
        setName('');
        setPosition(null);
      } else {
        setStatus('❌ Failed to save location.');
      }
    } catch (err) {
      setStatus('❌ Error connecting to server.');
    }
  };

  return (
    <div>
      {/* Name input */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Enter location name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '8px', width: '250px', marginRight: '10px' }}
        />
        <button onClick={handleSubmit} style={{ padding: '8px 16px' }}>
          Save Location
        </button>
      </div>

      {/* Selected coords display */}
      {position && (
        <p>📍 Selected: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}</p>
      )}

      {status && <p>{status}</p>}

      {/* Map */}
      <MapContainer
        center={[7.2906, 80.6337]}   // centered on Kandy, LK 🇱🇰
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationPicker onSelect={setPosition} />

        {/* Show marker where user clicked */}
        {position && (
          <Marker position={[position.lat, position.lng]}>
            <Popup>{name || 'Selected location'}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
