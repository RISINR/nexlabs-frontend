import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { authAPI } from "../services/authAPI";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { setAuthSession } from '../utils/authStorage';
import { API_BASE_URL } from '../utils/apiBase';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await axios.post(`${API_BASE_URL}/auth/google-login`, {
          token: tokenResponse.access_token
        });
        setAuthSession(res.data.token, res.data.user, true);
        navigate('/');
      } catch (err) {
        console.error("Login Failed", err);
        setError("Failed to sign up with Google");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google Sign Up Failed"),
  });

  const handleCreateAccount = async () => {
    if (!firstName || !lastName || !displayName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await authAPI.register(firstName, lastName, email, password, displayName);
      localStorage.setItem('registerSuccess', 'true');
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
              <h2 style={{ fontSize: '2.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Join us</h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.95, maxWidth: '60ch' }}>Unlock the tools built for the next generation of talents.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Create account</h1>
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
          marginBottom: '1.5rem',
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          Sign up with Google
        </button>

        {/* First Name */}
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            marginBottom: '0.75rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          placeholder="e.g. John"
        />

        {/* Last Name */}
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            marginBottom: '0.75rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          placeholder="e.g. Doe"
        />

        {/* Display Name */}
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            marginBottom: '0.75rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          placeholder="e.g. john_dev (will appear on your profile)"
        />

        {/* Email */}
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            marginBottom: '0.75rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          placeholder="you@example.com"
        />

        {/* Password */}
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Password</label>
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
            marginBottom: '0.75rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          placeholder="Password (at least 8 characters)"
        />

        {/* Confirm Password */}
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          placeholder="Confirm your password"
        />

        {/* Create Account Button */}
        <button
          onClick={handleCreateAccount}
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
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        {/* Sign In Link */}
        <p style={{ textAlign: 'center', color: 'rgb(107,114,128)', fontSize: '0.9rem' }}>
          Already a member?{' '}
          <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
            Return to NexLabs
          </Link>
        </p>
      </div>
    </div>
  );
}
