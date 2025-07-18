import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import TrackAnalysis from "./TrackAnalysis";

import PlaylistOptimizer from "./PlaylistOptimizer";

import Analytics from "./Analytics";

import ArtistTools from "./ArtistTools";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    TrackAnalysis: TrackAnalysis,
    
    PlaylistOptimizer: PlaylistOptimizer,
    
    Analytics: Analytics,
    
    ArtistTools: ArtistTools,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/TrackAnalysis" element={<TrackAnalysis />} />
                
                <Route path="/PlaylistOptimizer" element={<PlaylistOptimizer />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/ArtistTools" element={<ArtistTools />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}