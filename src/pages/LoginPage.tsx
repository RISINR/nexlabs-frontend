import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { authAPI } from "../services/authAPI";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { setAuthSession } from '../utils/authStorage';

const RAW_API_BASE_URL = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_URL || '';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, '').endsWith('/api')
  ? RAW_API_BASE_URL.replace(/\/$/, '')
  : `${RAW_API_BASE_URL.replace(/\/$/, '')}/api`;

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await axios.post(`${API_BASE_URL}/auth/google-login`, {
          token: tokenResponse.access_token
        });
        setAuthSession(res.data.token, res.data.user, keepLoggedIn);
        if (keepLoggedIn) localStorage.setItem('keepLoggedIn', 'true');
        else localStorage.removeItem('keepLoggedIn');
        navigate('/');
      } catch (err) {
        console.error("Login Failed", err);
        setError("Failed to login with Google");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google Login Failed"),
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await authAPI.login(email, password);
      setAuthSession(response.token, response.user, keepLoggedIn);
      if (keepLoggedIn) localStorage.setItem('keepLoggedIn', 'true');
      else localStorage.removeItem('keepLoggedIn');
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'white' }}>
      {/* Left Side - Gradient Background (wrapped with white margin) */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        boxSizing: 'border-box'
      }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '20px', background: 'white', padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '12px', position: 'relative', overflow: 'hidden', padding: '2rem', boxSizing: 'border-box' }}>
            <video
              src="/videos/Curved_gradient_shape_moving_e3b322e4ac.mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', left: '2rem', bottom: '2rem', zIndex: 1, textAlign: 'left', color: 'white' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Welcome back</h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.95, maxWidth: '60ch' }}>Ready to pick up where your innovation left off?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome back, Talent!</h1>
        <p style={{ color: 'rgb(107,114,128)', marginBottom: '2rem' }}>Ready to level up your career?</p>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            color: '#b91c1c',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {/* Google Sign In */}
        <button onClick={() => loginWithGoogle()} style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          background: 'white',
          cursor: 'pointer',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <text>G</text>
          </svg>
          Sign in with Google
        </button>

        {/* SSO Sign In */}
        <button onClick={() => navigate('/sso-login')} style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          background: 'white',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          Sign in with SSO
        </button>

        {/* Email */}
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Your email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          placeholder="you@example.com"
        />

        {/* Password */}
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          placeholder="••••••••••••••••••••••••"
        />

        {/* Keep Logged In & Forgot Password */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>Keep me logged in</span>
          </label>
          <Link to="/forgot-password" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
            Forgot Password
          </Link>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
            marginBottom: '1rem'
          }}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        {/* Sign Up Link */}
        <p style={{ textAlign: 'center', color: 'rgb(107,114,128)', fontSize: '0.9rem' }}>
          New to the experiment?{' '}
          <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
            Join NexLabs
          </Link>
        </p>
      </div>
    </div>
  );
}
