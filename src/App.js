import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Navbar from './components/Navbar'; 
import Profile from './components/profile';

function App() {
    return (
        <Router>
            <Navbar />  {/* This ensures the Navbar is visible */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;
