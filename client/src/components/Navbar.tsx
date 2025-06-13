/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import AuthModal from "./AuthModal";
import RegisterModal from "./RegisterModal";
import eventIcon from "../assets/eventicon.png";
import userLogo from "../assets/userlogo.png";
import { FaSearch } from "react-icons/fa";
import EventContext from "../context/EventContext";

export default function Navbar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  useContext(EventContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

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

  let avatarUrl = userLogo;
  let isGoogleUser = false;
  if (user) {
    isGoogleUser = user.providerData.some(
      (provider) => provider.providerId === "google.com"
    );
    if (isGoogleUser && user.photoURL) {
      avatarUrl = user.photoURL;
    }
  }

  const MobileAuthButtons = (
    <>
      <li>
        <button className="btn btn-primary btn-sm w-full mb-2" onClick={() => setShowLogin(true)}>
          Sign In
        </button>
      </li>
      <li>
        <button className="btn btn-outline btn-sm w-full" onClick={() => setShowRegister(true)}>
          Register
        </button>
      </li>
    </>
  );

  // Search modal logic: always redirect to main event page, set search, and scroll to event section
  const handleSearchModal = async () => {
    if (!search.trim()) {
      alert("Please enter a search term!");
      return;
    }
    setSearchLoading(true);
    try {
      // Always redirect to main event page ("/")
      // Pass search as state so EventFilters/EventList can use it
      setShowSearch(false);
      setSearchLoading(false);
      setTimeout(() => {
        if (location.pathname !== "/") {
          navigate("/", { state: { searchFromNavbar: search.trim() } });
        } else {
          // If already on main page, trigger search logic directly
          const eventInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
          if (eventInput) {
            eventInput.value = search.trim();
            eventInput.dispatchEvent(new Event("input", { bubbles: true }));
            eventInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
          }
          // Scroll to event section if present
          const eventSection = document.getElementById("event-section");
          if (eventSection) {
            eventSection.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 100);
      setSearch("");
    } catch {
      setError("Could not search events.");
      setSearchLoading(false);
    }
  };

  // Listen for navigation to "/" and auto-fill search if coming from navbar
  useEffect(() => {
    if (
      location.pathname === "/" &&
      location.state &&
      (location.state as any).searchFromNavbar
    ) {
      const searchValue = (location.state as any).searchFromNavbar;
      setTimeout(() => {
        const eventInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
        if (eventInput) {
          eventInput.value = searchValue;
          eventInput.dispatchEvent(new Event("input", { bubbles: true }));
          eventInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        }
        const eventSection = document.getElementById("event-section");
        if (eventSection) {
          eventSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
      // Remove state so it doesn't repeat on next navigation
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  // Search modal
  const SearchModal = showSearch && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowSearch(false)}>
      <div
        className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-xs w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={() => setShowSearch(false)}
          aria-label="Close"
        >
          ×
        </button>
        <div className="mb-2">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Search events by name or tag"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
            onKeyDown={e => {
              if (e.key === "Enter") handleSearchModal();
            }}
          />
        </div>
        <button
          className="btn btn-primary w-full mb-2"
          onClick={handleSearchModal}
          disabled={searchLoading}
        >
          {searchLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );

  return (
    <nav className="bg-base-100 shadow-md border-b border-blue-100 w-full">
      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-4 h-20">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src={eventIcon} alt="logo" className="h-20 w-20" />
            <span className="text-2xl font-bold text-blue-700 tracking-wide">
              Japan-Events
            </span>
          </Link>
        </div>

        {/* Main Navigation */}
        <div className="flex items-center gap-4">
          {user && (
            <Link to="/timeline" className="btn btn-ghost btn-lg text-blue-700">
              My Event Timeline
            </Link>
          )}
        </div>

        {/* Auth + Search */}
        <div className="flex gap-2 items-center">
          {/* Magnifying glass icon */}
          <button
            className="btn btn-ghost btn-circle"
            title="Search events"
            onClick={() => setShowSearch(true)}
            aria-label="Search"
          >
            <FaSearch className="w-5 h-5 text-blue-700" />
          </button>
          {user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition">
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = userLogo;
                    }}
                  />
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content mt-3 p-4 shadow menu menu-sm bg-white rounded-box w-52 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="avatar online">
                    <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = userLogo;
                        }}
                      />
                    </div>
                  </div>
                  <span className="font-semibold text-sm">{user.displayName || user.email}</span>
                </div>
                {/* Only show Profile Settings for local users */}
                {!isGoogleUser && (
                  <li>
                    <button onClick={() => navigate("/profile")}>Profile Settings</button>
                  </li>
                )}
                <li>
                  <Link to="/timeline">My Event Timeline</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Sign Out</button>
                </li>
              </ul>
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
            {user ? (
              <>
                <li className="flex flex-col items-center justify-center gap-2 py-2">
                  <div className="avatar online">
                    <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = userLogo;
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs">{user.displayName || user.email}</span>
                </li>
                {/* Only show Profile Settings for local users */}
                {!isGoogleUser && (
                  <li>
                    <button className="btn btn-outline btn-sm mt-2 w-full" onClick={() => navigate("/profile")}>
                      Profile Settings
                    </button>
                  </li>
                )}
                <li>
                  <Link to="/timeline" className="btn btn-outline btn-sm w-full mt-2">
                    My Event Timeline
                  </Link>
                </li>
                <li>
                  <button className="btn btn-outline btn-sm mt-2 w-full" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              MobileAuthButtons
            )}
          </ul>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img src={eventIcon} alt="logo" className="h-6 w-6" />
            <span className="text-lg font-bold text-blue-700">
              Japan-Events.com
            </span>
          </Link>
        </div>
        {/* Magnifying glass icon on the right */}
        <button
          className="btn btn-ghost btn-circle ml-2"
          title="Search events"
          onClick={() => setShowSearch(true)}
          aria-label="Search"
        >
          <FaSearch className="w-5 h-5 text-blue-700" />
        </button>
      </div>

      {/* Search Modal */}
      {SearchModal}

      {/* Modals */}
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
      {/* Alerts */}
      {error && <div className="fixed top-16 right-4 alert alert-error shadow-lg">{error}</div>}
      {loading && <div className="fixed top-16 right-4 alert alert-info shadow-lg">Loading...</div>}
    </nav>
  );
}