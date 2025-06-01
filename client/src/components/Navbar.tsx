import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";

export default function Navbar() {
  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong when logging in.");
      }
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        const code = (err as { code?: string }).code;
        setError(`${err.message}${code ? ` (${code})` : ""}`);
      } else {
        setError("Something went wrong when logging in.");
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const code = (err as { code?: string }).code;
        setError(`${err.message}${code ? ` (${code})` : ""}`);
      } else {
        setError("Something went wrong when logging in.");
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Responsive login form (shared)
  const LoginForm = (
    <>
      <input
        type="email"
        placeholder="Email"
        className="input input-bordered input-sm w-28 md:w-36"
        autoComplete="username"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        className="input input-bordered input-sm w-24 md:w-32"
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={loading}
      />
      <button
        type="button"
        className="btn btn-primary btn-sm"
        disabled={loading}
        onClick={handleLogin}
      >
        Login
      </button>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        disabled={loading}
        onClick={handleRegister}
      >
        Register
      </button>
      {/* Divider */}
      <div className="mx-1 text-xs text-gray-400">or</div>
      {/* Google Sign-in */}
      <button
        type="button"
        className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-md flex items-center px-2 py-1 gap-2 shadow-sm btn-sm"
        style={{ minWidth: "140px" }}
        disabled={loading}
        onClick={handleGoogleLogin}
      >
        <svg width="20" height="20" viewBox="0 0 48 48">
          <g>
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.65 1.22 9.14 3.61l6.81-6.81C36.54 2.36 30.81 0 24 0 14.77 0 6.71 5.51 2.69 13.44l7.98 6.19C13.07 13.18 18.14 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.09 24.59c0-1.64-.15-3.22-.44-4.74H24v9.07h12.48c-.54 2.9-2.19 5.35-4.68 7.01l7.21 5.61C43.36 37.73 46.09 31.74 46.09 24.59z"/>
            <path fill="#FBBC05" d="M10.67 28.36A14.49 14.49 0 0 1 9.5 24c0-1.53.26-3.01.72-4.36l-7.98-6.19A23.982 23.982 0 0 0 0 24c0 3.82.92 7.44 2.69 10.56l7.98-6.2z"/>
            <path fill="#EA4335" d="M24 47.5c6.49 0 11.93-2.15 15.91-5.83l-7.21-5.61c-2.01 1.36-4.57 2.16-8.7 2.16-5.86 0-10.93-3.68-12.82-8.94l-7.98 6.2C6.71 42.49 14.77 47.5 24 47.5z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </g>
        </svg>
        <span className="text-xs">Sign in with Google</span>
      </button>
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
        <a className="btn btn-ghost btn-sm text-blue-700">Events</a>
        <div className="dropdown dropdown-hover">
          <label tabIndex={0} className="btn btn-ghost btn-sm text-blue-700">Categories</label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-56 max-h-60 overflow-y-auto border border-blue-100 z-50">
            {[
              "Music","Business & Professional","Food & Drink","Community & Culture","Performing & Visual Arts",
              "Film, Media & Entertainment","Sports & Fitness","Health & Wellness","Science & Technology",
              "Travel & Outdoor","Charity & Causes","Religion & Spirituality","Family & Education",
              "Seasonal & Holiday","Government & Politics","Fashion & Beauty","Home & Lifestyle",
              "Auto, Boat & Air","Hobbies & Special Interest","School Activities","Other"
            ].map(cat => (
              <li key={cat}><a>{cat}</a></li>
            ))}
          </ul>
        </div>
        <div className="dropdown dropdown-hover">
          <label tabIndex={0} className="btn btn-ghost btn-sm text-blue-700">Location</label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-44 border border-blue-100 z-50">
            {[
              "Adachi","Arakawa","Bunkyō","Chiyoda","Chūō","Edogawa","Itabashi","Katsushika","Kita","Kōtō",
              "Meguro","Minato","Nakano","Nerima","Ōta","Setagaya","Shibuya","Shinagawa","Shinjuku","Suginami",
              "Sumida","Taitō","Toshima"
            ].map(ward => (
              <li key={ward}><a>{ward} Ward</a></li>
            ))}
          </ul>
        </div>
        <div className="dropdown dropdown-hover">
          <label tabIndex={0} className="btn btn-ghost btn-sm text-blue-700">Price</label>
          <div tabIndex={0} className="dropdown-content bg-white p-4 shadow rounded-box w-56 border border-blue-100 z-50">
            <input type="number" placeholder="Max price (¥)" className="input input-bordered w-full max-w-xs mb-2" />
            <button className="btn btn-primary btn-sm w-full">Apply</button>
          </div>
        </div>
        <a className="btn btn-ghost btn-sm text-blue-700">Event Calendar</a>
      </div>
      {/* Auth */}
      <div>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">Hi, {user.email || user.displayName}</span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          // Desktop: login in dropdown (just like mobile)
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-primary btn-sm">
              Sign In
            </label>
            <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-80 p-4 shadow bg-base-100 mt-4">
              <form className="flex flex-col gap-2" onSubmit={e => e.preventDefault()}>
                {LoginForm}
              </form>
            </div>
          </div>
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
          <li><a>Events</a></li>
          <li tabIndex={0}>
            <details>
              <summary>Categories</summary>
              <ul className="p-2">
                {[
                  "Music","Business & Professional","Food & Drink","Community & Culture","Performing & Visual Arts",
                  "Film, Media & Entertainment","Sports & Fitness","Health & Wellness","Science & Technology",
                  "Travel & Outdoor","Charity & Causes","Religion & Spirituality","Family & Education",
                  "Seasonal & Holiday","Government & Politics","Fashion & Beauty","Home & Lifestyle",
                  "Auto, Boat & Air","Hobbies & Special Interest","School Activities","Other"
                ].map(cat => (
                  <li key={cat}><a>{cat}</a></li>
                ))}
              </ul>
            </details>
          </li>
          <li tabIndex={0}>
            <details>
              <summary>Location</summary>
              <ul className="p-2">
                {[
                  "Adachi","Arakawa","Bunkyō","Chiyoda","Chūō","Edogawa","Itabashi","Katsushika","Kita","Kōtō",
                  "Meguro","Minato","Nakano","Nerima","Ōta","Setagaya","Shibuya","Shinagawa","Shinjuku","Suginami",
                  "Sumida","Taitō","Toshima"
                ].map(ward => (
                  <li key={ward}><a>{ward} Ward</a></li>
                ))}
              </ul>
            </details>
          </li>
          <li tabIndex={0}>
            <details>
              <summary>Price</summary>
              <ul className="p-2">
                <li>
                  <input type="number" placeholder="Max price (¥)" className="input input-bordered w-full max-w-xs mb-2" />
                  <button className="btn btn-primary btn-sm w-full">Apply</button>
                </li>
              </ul>
            </details>
          </li>
          <li><a>Event Calendar</a></li>
          <li className="mt-2">
            {/* Mobile login form */}
            {!user && (
              <form className="flex flex-col gap-2" onSubmit={e => e.preventDefault()}>
                {LoginForm}
              </form>
            )}
            {user && (
              <button className="btn btn-outline btn-sm mt-2 w-full" onClick={handleLogout}>Logout</button>
            )}
          </li>
        </ul>
      </div>
      <div className="flex items-center space-x-2">
        <img src="https://cdn-icons-png.flaticon.com/512/609/609803.png" alt="logo" className="h-6 w-6" />
        <span className="text-lg font-bold text-blue-700">Event Curator</span>
      </div>
      <div /> {/* Space for symmetry */}
    </div>
    {/* Show error or loading */}
    {error && <div className="fixed top-16 right-4 alert alert-error shadow-lg">{error}</div>}
    {loading && <div className="fixed top-16 right-4 alert alert-info shadow-lg">Loading...</div>}
  </nav>
);
}
