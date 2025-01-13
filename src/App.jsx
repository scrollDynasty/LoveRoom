import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import EntryDetail from './components/EntryDetail';

function App() {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const isAuth = localStorage.getItem('authenticated') === 'true';
        setAuthenticated(isAuth);
    }, []);

    return (
        <Router>
            <Routes>
                <Route 
                    path="/login" 
                    element={
                        authenticated ? 
                        <Navigate to="/dashboard" /> : 
                        <Auth setAuthenticated={setAuthenticated} />
                    } 
                />
                <Route 
                    path="/dashboard" 
                    element={
                        authenticated ? 
                        <Dashboard setAuthenticated={setAuthenticated} /> : 
                        <Navigate to="/login" />
                    } 
                />
                <Route 
                    path="/entry/:id" 
                    element={
                        authenticated ? 
                        <EntryDetail /> : 
                        <Navigate to="/login" />
                    } 
                />
                <Route 
                    path="/" 
                    element={<Navigate to={authenticated ? "/dashboard" : "/login"} />} 
                />
            </Routes>
        </Router>
    );
}

export default App;