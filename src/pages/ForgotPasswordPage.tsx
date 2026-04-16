import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { authAPI } from "../services/authAPI";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Call password reset API
      const response = await authAPI.requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleResetPassword();
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
                <h2 style={{ fontSize: '2.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Reset Password</h2>
                <p style={{ fontSize: '1.25rem', opacity: 0.95, maxWidth: '60ch' }}>We'll help you regain access to your account.</p>
              </div>
            </div>
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Forgot Password?</h1>
        <p style={{ color: 'rgb(107,114,128)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {success ? (
          <div style={{
            padding: '1rem',
            background: '#d1fae5',
            border: '1px solid #a7f3d0',
            borderRadius: '0.5rem',
            color: '#047857',
            marginBottom: '1.5rem'
          }}>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Check your email</p>
            <p style={{ fontSize: '0.9rem' }}>We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.</p>
          </div>
        ) : (
          <>
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
              placeholder="you@example.com"
            />

            {/* Reset Button */}
            <button
              onClick={handleResetPassword}
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
              {loading ? 'Sending reset link...' : 'Send Reset Link'}
            </button>
          </>
        )}

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
