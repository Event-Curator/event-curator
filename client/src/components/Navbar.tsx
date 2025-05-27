export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md px-6">
      {/* Left: Dropdown */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Events</a>
            </li>
            <li>
              <a>Categories</a>
            </li>
            <li>
              <a>Contact</a>
            </li>
          </ul>
        </div>
      </div>
      {/* Center: Logo + Icon */}
      <div className="navbar-center flex items-center space-x-2">
        <img src="https://cdn-icons-png.flaticon.com/512/609/609803.png" alt="logo" className="h-8 w-8" />
        <span className="text-xl font-bold tracking-widest">EventCurator</span>
      </div>
      {/* Right: Login */}
      <div className="navbar-end">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Email"
            className="input input-bordered input-sm w-32 md:w-44"
          />
          <button className="btn btn-primary btn-sm">Login</button>
        </div>
      </div>
    </div>
  );
}
