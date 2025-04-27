import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { navigate } from "wouter/use-browser-location";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
}

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  server?: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = (): Errors => {
    let formErrors: Errors = {};
    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.email) formErrors.email = "Email is required";
    if (!formData.password) formErrors.password = "Password is required";
    if (!formData.role) formErrors.role = "Role is required";
    return formErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      console.log(formData);
      debugger;
      const response: AxiosResponse = await axios.post(
        'http://localhost:5000/api/users/register',
        formData
      );
      if (response.status === 200 || response.status === 201) {
        setSuccess("User registered successfully!");
        setFormData({ name: "", email: "", password: "", role: "student" });
        setErrors({});
        navigate('/login');
      }
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);
      setErrors({ server: "Failed to register user. Please try again." });
    }
  };

  const handleGoogleLogin = async (response: CredentialResponse) => {
    console.log("Google Login Response:", response);

    if (!response || !response.credential) {
      console.error("Google credential is missing");
      setErrors({ server: "Google login failed. Please try again." });
      return;
    }

    try {
      const decoded: JwtPayload & { name: string; email: string; sub: string } =
        jwtDecode(response.credential);
      console.log("Decoded Google JWT:", decoded);

      const googleUserData: FormData = {
        name: decoded.name,
        email: decoded.email,
        password: decoded.sub,
        role: "student",
      };

      const backendResponse: AxiosResponse = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/users`,
        googleUserData
      );

      console.log("Backend Response:", backendResponse.data);
      if (backendResponse.data.success) {
        setSuccess("Google Sign-Up successful! Welcome to FocusMeet.");
        setErrors({});
      } else {
        setErrors({
          server:
            backendResponse.data.message ||
            "Failed to register Google user. Please try again.",
        });
      }
    } catch (error: any) {
      console.error(
        "Google login error:",
        error.response?.data || error.message
      );
      setErrors({
        server: "Failed to authenticate with Google. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl flex">
        {/* Left Side (Text and Image) */}
        <div className="w-1/2 pr-8">
          <div className="info-section mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              Welcome to FocusMeet
            </h2>
            <p className="text-gray-600">
              Experience seamless task management with our innovative platform.
              Sign up today and enjoy the benefits of productivity and
              efficiency.
            </p>
          </div>
          <img
            src="/images/meeting.PNG"
            alt="FocusMeet Illustration"
            className="w-full mt-4"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="w-1/2">
          <div className="form-section">
            <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
            {success && <p className="text-green-600 mb-2">{success}</p>}
            {errors.server && (
              <p className="text-red-600 mb-2">{errors.server}</p>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic">{errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs italic">{errors.email}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs italic">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Role:
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs italic">{errors.role}</p>
                )}
              </div>

              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4">
                Sign Up
              </button>

              <div className="mb-4">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => console.log("Google Login Failed")}
                />
              </div>

              <p className="text-center">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500">
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
