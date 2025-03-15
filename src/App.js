import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Home from './components/home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Navbar from './components/Navbar'; 
import Profile from './components/profile';
import About from './components/About';
import FeedBack from './components/feedback';


function App() {
    // Assume isLoggedIn state is managed here
    const isLoggedIn = false; // Change this dynamically based on actual login state

    return (
        <Router>
            <Routes>
                {/* Landing Page route does not need Navbar */}
                <Route path="/" element={<LandingPage />} />

                {/* Routes with Navbar */}
                <Route path="/signup" element={
                    <>
                        <Navbar isLoggedIn={isLoggedIn} />
                        <SignUp />
                    </>
                } />

                <Route path="/login" element={
                    <>
                        <Navbar isLoggedIn={isLoggedIn} />
                        <Login />
                    </>
                } />
                
                <Route path="/home" element={
                    <>
                        <Navbar isLoggedIn={isLoggedIn} />
                        <Home />
                    </>
                } />
                
                {/* Profile Route with Navbar */}
                <Route path="/profile" element={
                    <>
                        <Navbar isLoggedIn={isLoggedIn} />
                        <Profile />
                    </>
                } />

                {/* About and Feedback Routes */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<FeedBack />} />
            </Routes>
        </Router>
    ); 
}

export default App;
