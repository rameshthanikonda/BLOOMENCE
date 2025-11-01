import React, { useState, useEffect, useRef, useCallback } from 'react';
import './EmergencyContact.css'; // Import the new CSS file

// --- SVG ICONS --- //
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const DirectionsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
    </svg>
);

const LocateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L7 22l-4-9 14-7z" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

const HospitalListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
);

// --- MOCK DATA FOR EMERGENCY CONTACTS --- //
const emergencyContacts = [
    { id: 1, name: 'Dr. Priyanka Shetty', specialty: 'Clinical Psychologist', phone: '+91 98765 43210' },
    { id: 2, name: 'Dr. Vishnu Nair', specialty: 'Psychiatrist', phone: '+91 91234 56789' },
    { id: 3, name: 'HopeLine India', specialty: '24/7 Suicide Prevention', phone: '91529 87821' },
    { id: 4, name: 'Mental Health Foundation', specialty: 'Support & Information', phone: '1800-233-3330' },
];

function EmergencyContact() {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const routingControl = useRef(null);
    const hospitalMarkers = useRef([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [nearbyHospitals, setNearbyHospitals] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [statusMessage, setStatusMessage] = useState('Initializing...');
    const [isResultsCollapsed, setIsResultsCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadScripts = useCallback(() => {
        const scripts = [
            { type: 'css', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' },
            { type: 'css', href: 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css' },
        ];
        scripts.forEach(s => {
            if (!document.querySelector(`link[href="${s.href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = s.href;
                document.head.appendChild(link);
            }
        });
        const loadJs = (src, onLoad) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                if (window.L?.Routing) onLoad();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = onLoad;
            document.body.appendChild(script);
        };
        loadJs('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', () => {
            loadJs('https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js', initializeMap);
        });
    }, []);

    const clearHospitalMarkers = () => {
        hospitalMarkers.current.forEach(marker => marker.remove());
        hospitalMarkers.current = [];
    };

    const fetchNearbyHospitals = useCallback((bounds) => {
        setIsLoading(true);
        setStatusMessage('Searching for facilities...');
        const overpassQuery = `[out:json];(node["amenity"~"hospital|clinic|doctors"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});way["amenity"~"hospital|clinic|doctors"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}););out center;`;

        fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: overpassQuery })
            .then(response => response.json())
            .then(data => {
                clearHospitalMarkers();
                const hospitals = data.elements.map(el => ({
                    id: el.id,
                    name: el.tags.name || 'Medical Facility',
                    lat: el.lat || el.center.lat,
                    lng: el.lon || el.center.lon,
                }));
                setNearbyHospitals(hospitals);

                const hospitalIcon = window.L.divIcon({
                    className: 'hospital-marker-icon',
                    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e74c3c" stroke="#ffffff" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path d="M12 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8z"/></svg>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32],
                });

                hospitals.forEach(hospital => {
                    const marker = window.L.marker([hospital.lat, hospital.lng], { icon: hospitalIcon })
                        .addTo(mapInstance.current)
                        .bindPopup(`<b>${hospital.name}</b>`);
                    hospitalMarkers.current.push(marker);
                });

                setStatusMessage(`${hospitals.length || 'No'} facilities found in view`);
                setIsLoading(false);
            })
            .catch(() => {
                setStatusMessage('Could not fetch data');
                setIsLoading(false);
            });
    }, []);

    const initializeMap = useCallback(() => {
        if (mapInstance.current) return;

        const defaultLocation = [20.5937, 78.9629]; // Center of India
        mapInstance.current = window.L.map(mapRef.current, { zoomControl: false }).setView(defaultLocation, 5);
        window.L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(mapInstance.current);

        mapInstance.current.on('moveend', () => fetchNearbyHospitals(mapInstance.current.getBounds()));

        if (navigator.geolocation) {
            setStatusMessage('Getting your location...');
            navigator.geolocation.getCurrentPosition(
                position => {
                    const userCoords = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(userCoords);
                    mapInstance.current.setView(userCoords, 14);
                    const userIcon = window.L.divIcon({ className: 'user-location-icon', html: '<div class="pulsing-dot"></div>', iconSize: [24, 24] });
                    window.L.marker(userCoords, { icon: userIcon }).addTo(mapInstance.current).bindPopup('<b>You are here</b>');
                },
                () => {
                    setStatusMessage('Location access denied');
                    fetchNearbyHospitals(mapInstance.current.getBounds());
                }
            );
        } else {
            fetchNearbyHospitals(mapInstance.current.getBounds());
        }
    }, [fetchNearbyHospitals]);

    useEffect(() => { loadScripts(); }, [loadScripts]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery) return;
        setIsLoading(true);
        setStatusMessage(`Searching for "${searchQuery}"...`);

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    mapInstance.current.setView([data[0].lat, data[0].lon], 14);
                } else {
                    setStatusMessage(`Could not find: "${searchQuery}"`);
                    setIsLoading(false);
                }
            })
            .catch(() => {
                setStatusMessage('Search failed');
                setIsLoading(false);
            });
    };

    const handleGetDirections = (hospital) => {
        if (!userLocation) {
            alert('Your location is needed for directions.');
            return;
        }
        if (routingControl.current) {
            mapInstance.current.removeControl(routingControl.current);
        }
        routingControl.current = window.L.Routing.control({
            waypoints: [window.L.latLng(userLocation[0], userLocation[1]), window.L.latLng(hospital.lat, hospital.lng)],
            routeWhileDragging: false,
            show: false,
            addWaypoints: false,
            lineOptions: { styles: [{ color: '#10B981', opacity: 0.8, weight: 6 }] }
        }).addTo(mapInstance.current);
    };

    const centerOnUser = () => {
        if (userLocation) {
            mapInstance.current.setView(userLocation, 14);
        } else {
            alert('Your location is not available.');
        }
    };

    return (
        <div className="emergency-container-professional">
            <header className="top-helplines-panel">
                <div className="helplines-content">
                    <h3>Emergency Helplines</h3>
                    <div className="helplines-grid">
                        {emergencyContacts.map(contact => (
                            <div key={contact.id} className="contact-item">
                                <div className="contact-info">
                                    <strong>{contact.name}</strong>
                                    <span>{contact.specialty}</span>
                                </div>
                                <a href={`tel:${contact.phone}`} className="contact-call-button">
                                    <PhoneIcon /> Call
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <main className="main-map-area">
                <div ref={mapRef} className="map-view-professional"></div>

                <form onSubmit={handleSearch} className="map-search-bar">
                    <SearchIcon />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search any city or location to find help..."
                    />
                    <button type="submit">Find</button>
                </form>

                <div className={`map-results-panel ${isResultsCollapsed ? 'collapsed' : ''}`}>
                    <button className="results-toggle-button" onClick={() => setIsResultsCollapsed(!isResultsCollapsed)}>
                        <ChevronLeftIcon />
                    </button>
                    <div className="results-header">
                        <HospitalListIcon />
                        <h3>Nearby Facilities</h3>
                    </div>
                    <p className="results-status">{statusMessage}</p>
                    <div className="results-list">
                        {isLoading ? (
                            <div className="loader-container"><div className="loader"></div></div>
                        ) : nearbyHospitals.length > 0 ? (
                            nearbyHospitals.map(hospital => (
                                <div key={hospital.id} className="list-item">
                                    <div className="item-info"><strong>{hospital.name}</strong></div>
                                    <button
                                        onClick={() => handleGetDirections(hospital)}
                                        className="directions-button"
                                        title="Get Directions"
                                    >
                                        <DirectionsIcon />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No facilities found in this map view. Pan the map or search for a city.</p>
                            </div>
                        )}
                    </div>
                </div>

                <button onClick={centerOnUser} className="locate-me-button" title="Center on my location">
                    <LocateIcon />
                </button>
            </main>
        </div>
    );
}

export default EmergencyContact;
