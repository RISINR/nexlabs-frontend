import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { authAPI } from "../services/authAPI";
import { setAuthSession } from '../utils/authStorage';

export default function SsoLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await authAPI.ssoLogin(email);
      const remember = (localStorage.getItem('keepLoggedIn') || 'true') === 'true';
      setAuthSession(response.token, response.user, remember);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleContinue();
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
            <div style={{ width: '100%', height: '100%', borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00a8ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
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

      {/* Right Side - SSO Login Form */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        maxWidth: '500px',
        margin: '0 auto',
        overflowY: 'auto',
        maxHeight: '100vh'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Sign in with SSO</h1>
        <p style={{ color: 'rgb(107,114,128)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Enter your work or personal email. We'll check if an account exists and help you sign in.
        </p>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            color: '#b91c1c',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {/* Email Input */}
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
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
          placeholder="you@company.com"
        />

        {/* Continue Button */}
        <button
          onClick={handleContinue}
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
          {loading ? 'Signing in...' : 'Continue'}
        </button>

        {/* SSO Login Button */}
        <button style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          background: 'white',
          cursor: 'pointer',
          marginBottom: '1rem',
          fontSize: '1rem',
          fontWeight: '600',
          color: '#2563eb'
        }}>
          Sign in with SSO
        </button>

        {/* Back to Login Link */}
        <p style={{ textAlign: 'center', color: 'rgb(107,114,128)', fontSize: '0.9rem' }}>
          <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
