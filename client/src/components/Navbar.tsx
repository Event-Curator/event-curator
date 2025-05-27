export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md px-4 md:px-6">
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

      {/* Center: Logo + Icon, always visible */}
      <div className="navbar-center flex items-center space-x-2">
        <img src="https://cdn-icons-png.flaticon.com/512/609/609803.png" alt="logo" className="h-8 w-8" />
        <span className="text-xl font-bold tracking-widest whitespace-nowrap">EventCurator</span>
      </div>

      {/* Right: Login form, collapses on small screens */}
      <div className="navbar-end">
        {/* Large screen: show full form */}
        <form className="hidden lg:flex items-center gap-2">
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered input-sm w-28 md:w-36"
            autoComplete="username"
            disabled
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered input-sm w-24 md:w-32"
            autoComplete="current-password"
            disabled
          />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled
          >
            Sign In
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled
          >
            Login
          </button>
          {/* Divider */}
          <div className="mx-1 text-xs text-gray-400">or</div>
          {/* Official Google Button */}
          <button
            type="button"
            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-md flex items-center px-2 py-1 gap-2 shadow-sm btn-sm"
            style={{ minWidth: "140px" }}
            disabled
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
        </form>

        {/* Small screens: collapse to Login dropdown */}
        <div className="lg:hidden dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-primary btn-sm btn-circle m-1">
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25v-.75A4.5 4.5 0 0 1 9 15h6a4.5 4.5 0 0 1 4.5 4.5v.75"/>
            </svg>
          </label>
          <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-80 p-4 shadow bg-base-100">
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered input-sm w-full"
                autoComplete="username"
                disabled
              />
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered input-sm w-full"
                autoComplete="current-password"
                disabled
              />
              <div className="flex gap-2">
                <button type="button" className="btn btn-primary btn-sm flex-1" disabled>
                  Sign In
                </button>
                <button type="button" className="btn btn-outline btn-sm flex-1" disabled>
                  Login
                </button>
              </div>
              <div className="divider text-xs text-gray-400">or</div>
              <button
                type="button"
                className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-md flex items-center px-2 py-1 gap-2 shadow-sm btn-sm"
                style={{ minWidth: "140px" }}
                disabled
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
