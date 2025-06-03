import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { eventCategories, prefectures } from "./constants";
import AuthModal from "./AuthModal";
import RegisterModal from "./RegisterModal";

export default function Navbar() {
  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Modal state
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Auth Handlers
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setEmail("");
      setPassword("");
      setShowRegister(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong when registering.");
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setEmail("");
      setPassword("");
      setShowLogin(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const code = (err as { code?: string }).code;
        setError(`${err.message}${code ? ` (${code})` : ""}`);
      } else setError("Something went wrong when logging in.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setShowLogin(false);
      setShowRegister(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const code = (err as { code?: string }).code;
        setError(`${err.message}${code ? ` (${code})` : ""}`);
      } else setError("Something went wrong when logging in.");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Menu items for mobile auth
  const MobileAuthButtons = (
    <>
      <li>
        <button
          className="btn btn-primary btn-sm w-full mb-2"
          onClick={() => setShowLogin(true)}
        >
          Sign In
        </button>
      </li>
      <li>
        <button
          className="btn btn-outline btn-sm w-full"
          onClick={() => setShowRegister(true)}
        >
          Register
        </button>
      </li>
      {user && (
        <li>
          <button className="btn btn-outline btn-sm w-full mt-2" onClick={handleLogout}>
            Logout
          </button>
        </li>
      )}
    </>
  );

  return (
    <nav className="bg-base-100 shadow-md border-b border-blue-100 w-full">
      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-4 h-16">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <img src="https://cdn-icons-png.flaticon.com/512/609/609803.png" alt="logo" className="h-7 w-7" />
          <span className="text-2xl font-bold text-blue-700 tracking-wide">Event Curator</span>
        </div>
        {/* Main Navigation */}
        <div className="flex items-center gap-4">
          <div className="dropdown dropdown-hover">
            <label tabIndex={0} className="btn btn-ghost btn-sm text-blue-700">Categories</label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-56 max-h-60 overflow-y-auto border border-blue-100 z-50">
              {eventCategories.map(cat => (
                <li key={cat}>
                  <Link to={`/category/${encodeURIComponent(cat)}`}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="dropdown dropdown-hover">
            <label tabIndex={0} className="btn btn-ghost btn-sm text-blue-700">Location</label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-44 border border-blue-100 z-50">
              {prefectures.map(pref => (
                <li key={pref}>
                  <Link to={`/location/${encodeURIComponent(pref)}`}>{pref} Prefecture</Link>
                </li>
              ))}
            </ul>
          </div>
          <Link to="/timeline" className="btn btn-ghost btn-sm text-blue-700">My Event Timeline</Link>
        </div>
        {/* Auth */}
        <div className="flex gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">Hi, {user.email || user.displayName}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => setShowRegister(true)}>
                Register
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowLogin(true)}>
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 h-14 w-full">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-3 shadow bg-white rounded-box w-64 mt-2 border border-blue-100 z-50">
            <li><Link to="/events">Events</Link></li>
            <li tabIndex={0}>
              <details>
                <summary>Categories</summary>
                <ul className="p-2">
                  {eventCategories.map(cat => (
                    <li key={cat}>
                      <Link to={`/category/${encodeURIComponent(cat)}`}>{cat}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <li tabIndex={0}>
              <details>
                <summary>Location</summary>
                <ul className="p-2">
                  {prefectures.map(pref => (
                    <li key={pref}>
                      <Link to={`/location/${encodeURIComponent(pref)}`}>{pref} Prefecture</Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            {/* MOBILE EVENT TIMELINE BUTTON */}
            <li><Link to="/timeline">Event Timeline</Link></li>
            {/* Mobile login/register buttons */}
            {!user && MobileAuthButtons}
            {user && (
              <li>
                <button className="btn btn-outline btn-sm mt-2 w-full" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
        <div className="flex items-center space-x-2">
          <img src="https://cdn-icons-png.flaticon.com/512/609/609803.png" alt="logo" className="h-6 w-6" />
          <span className="text-lg font-bold text-blue-700">Event Curator</span>
        </div>
        <div /> {/* Space for symmetry */}
      </div>
      {/* Show modals */}
      {showLogin && (
        <AuthModal
          mode="login"
          onClose={() => setShowLogin(false)}
          onGoogleLogin={handleGoogleLogin}
          onEmailLogin={handleLogin}
          loading={loading}
          error={error}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      )}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onGoogleRegister={handleGoogleLogin}
          onEmailRegister={handleRegister}
          loading={loading}
          error={error}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      )}
      {/* Show error or loading */}
      {error && <div className="fixed top-16 right-4 alert alert-error shadow-lg">{error}</div>}
      {loading && <div className="fixed top-16 right-4 alert alert-info shadow-lg">Loading...</div>}
    </nav>
  );
}