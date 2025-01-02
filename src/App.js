import React, { useState } from 'react';
import Login from './Login';  // Adjust path if needed
import './App.css';

function App() {
    const [showLogin, setShowLogin] = useState(false);

    const handleLoginClick = () => {
        setShowLogin(!showLogin);  // Toggle visibility
    };

    return (
        <div>
            <nav>
                <button onClick={handleLoginClick}>Login</button>
            </nav>

            {showLogin && <Login />}  {/* Conditionally render */}
        </div>
    );
}

export default App;
