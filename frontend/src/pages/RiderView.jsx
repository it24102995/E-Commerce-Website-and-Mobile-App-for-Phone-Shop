import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { trackingService } from '../service/trackingService';
import Swal from 'sweetalert2';
import './Tracking.css';

// Fix for leaflet icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow });

function LocationPicker({ onSelect }) {
    useMapEvents({
        click(e) { onSelect(e.latlng); }
    });
    return null;
}

const RiderView = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [position, setPosition] = useState([7.2906, 80.6337]); // Kandy, LK
    const [selectedPos, setSelectedPos] = useState(null);
    const [rider, setRider] = useState(null);

    useEffect(() => {
        const storedRider = JSON.parse(localStorage.getItem('rider'));
        if (!storedRider) {
            navigate('/deliver-login');
            return;
        }
        setRider(storedRider);
    }, []);

    const handleUpdateLocation = async () => {
        if (!selectedPos) {
            Swal.fire('Tip', 'Please click on the map to set your current location.', 'info');
            return;
        }

        try {
            await trackingService.updateLocation(rider.id, orderId, selectedPos.lat, selectedPos.lng);
            Swal.fire('Success', 'Location updated for this order!', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to update location.', 'error');
        }
    };

    return (
        <div className="tracking-container">
            <header className="tracking-header">
                <div>
                    <h1>Share Location</h1>
                    <p className="customer-name">Order ID: #{orderId}</p>
                </div>
                <button onClick={() => navigate('/deliver-dashboard')} className="btn-accept" style={{background: 'transparent', color: 'var(--golden)', border: '1px solid var(--golden)'}}>← Back</button>
            </header>

            <div className="order-card" style={{padding: '2rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                    <p style={{color: '#6b7280'}}>Click on the map to select your current position, then hit Save.</p>
                    <button 
                        onClick={handleUpdateLocation}
                        className="btn-track"
                        style={{padding: '0.8rem 2rem'}}
                    >Save My Location</button>
                </div>

                <div className="map-container-wrapper" style={{height: '600px'}}>
                    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker onSelect={setSelectedPos} />
                        {selectedPos && (
                            <Marker position={[selectedPos.lat, selectedPos.lng]}>
                                <Popup>I am here!</Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default RiderView;
