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
import EventContext from "../context/EventContext";
import NavbarSearch from "./NavbarSearch";
import UserDropDown from "./UserDropdown";
import MobileNavbarSearch from "./MobileNavbarSearch";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // for mobile only
  const [showDesktopSearch, setShowDesktopSearch] = useState(false); // for desktop only
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setEvents } = useContext(EventContext);

  const api = import.meta.env.VITE_API;

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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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

  async function fetchEventsByName(name: string) {
    try {
      const response = await fetch(`${api}/events?name=${encodeURIComponent(name)}`);
      if (!response.ok) {
        setError("Failed to fetch events.");
        return;
      }
      const data = await response.json();
      const hero = document.getElementById("hero-section");
      if (hero) hero.style.display = "none";
      setEvents(data);
      const eventSection = document.getElementById("event-section");
      if (eventSection) {
        eventSection.scrollIntoView({ behavior: "smooth" });
      }
    } catch {
      setError("Could not search events.");
    }
  }

  const handleSearchModal = async () => {
    if (!search.trim()) {
      alert("Please enter a search term!");
      return;
    }
    setSearchLoading(true);
    try {
      setShowSearch(false);
      setShowDesktopSearch(false);
      setSearchLoading(false);
      if (location.pathname !== "/") {
        navigate("/", { state: { hideHero: true } });
        setTimeout(() => fetchEventsByName(search.trim()), 200);
      } else {
        fetchEventsByName(search.trim());
      }
      setSearch("");
    } catch {
      setError("Could not search events.");
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (
      location.pathname === "/" &&
      location.state &&
      (typeof location.state === "object") &&
      ("hideHero" in location.state)
    ) {
      setTimeout(() => {
        const hero = document.getElementById("hero-section");
        if (hero) hero.style.display = "none";
        const eventSection = document.getElementById("event-section");
        if (eventSection) {
          eventSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  

  return (
    <nav className="bg-base-100 shadow-md border-b border-blue-100 w-full">
      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-4 h-20">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src={eventIcon} alt="logo" className="h-20 w-20" />
            <span className="text-2xl font-bold text-blue-700 tracking-wide">
              Japan Events
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
          <NavbarSearch
            show={showDesktopSearch}
            setShow={setShowDesktopSearch}
            search={search}
            setSearch={setSearch}
            onSearch={handleSearchModal}
            searchLoading={searchLoading}
          />
          {user ? (
            <UserDropDown
              user={user}
              avatarUrl={avatarUrl}
              isGoogleUser={isGoogleUser}
              handleLogout={handleLogout}
            />
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
                    <div className="w-12 h-12 rounded-full">
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
              Japan Events
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

      {/* Search Modal (mobile only) */}
      <MobileNavbarSearch
        show={showSearch}
        setShow={setShowSearch}
        search={search}
        setSearch={setSearch}
        onSearch={handleSearchModal}
        searchLoading={searchLoading}
      />

      {/* Modals */}
      {showLogin && (
        <AuthModal
          mode="login"
          onClose={() => setShowLogin(false)}
          onGoogleLogin={handleGoogleLogin}
          //onAppleLogin={handleAppleLogin}
          //onFacebookLogin={handleFacebookLogin}
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
          //onAppleRegister={handleAppleLogin}
          //onFacebookRegister={handleFacebookLogin}
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
