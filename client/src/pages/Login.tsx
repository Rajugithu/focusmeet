import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Navigate } from 'react-router-dom';
import { navigate } from 'wouter/use-browser-location';
import { StringValidation } from 'zod';

interface LoginResponse {
  token: string;
  user: any;
}

interface ErrorResponse {
  message: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("Try to login");
      console.log(email, password);
      debugger;
      console.log("Try to login");
      const response: AxiosResponse<LoginResponse> = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password }
      );

      if (response.status === 200) {
        debugger;
        setIsLoggedIn(true);
        const userRole = response.data.user.role;


        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", userRole);


        if(userRole == "student"){
          navigate('/student-dashboard'); // Redirect to the dashboard
        }else{
          navigate('/teacher-dashboard'); // Redirect to the dashboard
        }
      }
    } catch (err: any) {
      if (err.response) {
        const errorData: ErrorResponse = err.response.data;
        setError(errorData?.message || 'Invalid email or password');
      } else if (err.request) {
        setError('Network error. Please try again later.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const userRole = localStorage.getItem("role");

  if (isLoggedIn) {
    return <Navigate to={userRole === "teacher" ? "/teacher-dashboard" : "/student-dashboard"} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="info-section mb-6">
          <h2 className="text-2xl font-semibold mb-2">Welcome to FocusMeet</h2>
          <p className="text-gray-600">
            Sign in to manage your tasks and stay productive. Experience seamless workflow management on our platform.
          </p>
        </div>
        <div className="form-section">
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="/signup" className="text-blue-500">
              Don't have an account? Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;