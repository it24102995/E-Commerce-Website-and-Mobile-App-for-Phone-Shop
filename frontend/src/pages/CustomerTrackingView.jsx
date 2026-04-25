import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { trackingService } from '../service/trackingService';
import './Tracking.css';

// Fix for leaflet icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow });

const CustomerTrackingView = () => {
    const { orderId } = useParams();
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const data = await trackingService.getOrderLocation(orderId);
                if (data) {
                    setLocation({ lat: data.latitude, lng: data.longitude });
                }
            } catch (error) {
                console.error('Tracking not available', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
        const interval = setInterval(fetchLocation, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, [orderId]);

    if (loading) return <div className="empty-text">Loading tracker...</div>;

    return (
        <div className="tracking-container">
            <h1 style={{ marginBottom: '1.5rem' }}>Track Your Order #{orderId}</h1>

            {!location ? (
                <div className="empty-text">
                    <p>Rider hasn't shared their location yet. Please wait...</p>
                </div>
            ) : (
                <div className="map-container-wrapper" style={{ height: '600px' }}>
                    <MapContainer center={[location.lat, location.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[location.lat, location.lng]}>
                            <Popup>Your Rider is here! 🚚</Popup>
                        </Marker>
                    </MapContainer>
                </div>
            )}

            <div className="status-banner">
                <div>
                    <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>Real-time Tracking Active</p>
                    <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>The map updates automatically as the rider moves.</p>
                </div>
                <span style={{ fontSize: '2.5rem' }}>🏁</span>
            </div>
        </div>
    );
};

export default CustomerTrackingView;
