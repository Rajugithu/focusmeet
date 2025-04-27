import React, { useEffect, ReactNode } from 'react';
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import MeetingPage from "./pages/MeetingPage";
import MeetingComponent from "./components/layout/MeetingComponent"; // Import the MeetingComponent
import MeetingWrapper from "./components/layout/MeetingWrapper"; 


interface ProtectedRouteProps {
    children: ReactNode;
    role?: "teacher" | "student";
}

const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

const getRole = () => {
    return localStorage.getItem("role");
};

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
    const [location, setLocation] = useLocation();

    useEffect(() => {
        if (!isAuthenticated()) {
            setLocation("/login");
            return;
        }
    }, [location, setLocation, role]);

    if (!isAuthenticated() || (role && getRole() !== role)) {
        return null;
    }

    return children;
};

function Router() {
    return (
        <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />

            {/* Protected Routes */}
            <Route path="/teacher-dashboard">
                <ProtectedRoute role="teacher">
                    <TeacherDashboard />
                </ProtectedRoute>
            </Route>

            <Route path="/student-dashboard">
                <ProtectedRoute role="student">
                    <StudentDashboard />
                </ProtectedRoute>
            </Route>

            {/* Protected Meeting Page */}
            <Route path="/meeting/:meetingId">
                <ProtectedRoute>
                    <MeetingWrapper />
                </ProtectedRoute>
            </Route>

            <Route component={NotFound} />
        </Switch>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router />
            <Toaster />
        </QueryClientProvider>
    );
}

export default App;
