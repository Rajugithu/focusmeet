import { Buffer } from 'buffer';
import process from 'process';

// Set the global objects that simple-peer expects
window.Buffer = Buffer;
window.process = process;

import { useEffect, ReactNode } from 'react';
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";

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

            {/* Route for Teacher page to Create meeting */}
            <Route path="/TeacherPage/:roomId">
                <ProtectedRoute role="teacher">
                    <TeacherPage />
                </ProtectedRoute>
            </Route>

            {/* Route for Student page to join the meeting */}
            <Route path="/StudentPage/:roomId">
                <ProtectedRoute role="student">
                    <StudentPage />
                </ProtectedRoute>
            </Route>

            <Route component={NotFound} path={''} />
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