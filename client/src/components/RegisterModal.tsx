import React, { useState } from "react";

type RegisterModalProps = {
  onClose: () => void;
  onGoogleRegister: () => void;
  onAppleRegister: () => void;
  onFacebookRegister: () => void;
  onEmailRegister: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  setEmail: (email: string) => void;
  setPassword: (pw: string) => void;
  setFullName?: (name: string) => void; // Optional for register only
};

export default function RegisterModal({
  onClose,
  onGoogleRegister,
  onAppleRegister,
  onFacebookRegister,
  onEmailRegister,
  loading,
  error,
  setEmail,
  setPassword,
  setFullName,
}: RegisterModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="
        fixed left-0 right-0 bottom-0
        flex items-center justify-center z-50
        sm:top-0
        top-[150px]
      "
      style={{ background: "rgba(255,255,255,0.01)" }}
    >
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-2 text-center">Create account</h2>
        <div className="text-gray-500 text-center mb-5">
          Already have an account?{" "}
          <span className="text-blue-600 underline cursor-pointer" onClick={onClose}>
            Sign in
          </span>
        </div>

        {/* Social Sign Up */}
        <div className="mb-6">
          <div className="mb-2 font-semibold text-xs text-gray-600 text-left">
            QUICKLY SIGN UP WITH
          </div>
          <div className="flex flex-col gap-2">
            {/* Google */}
            <button
              onClick={onGoogleRegister}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
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
              <span>Sign up with Google</span>
            </button>
            {/* Apple */}
            <button
              onClick={onAppleRegister}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="black">
                <path d="M16.75,13.63c-0.12-0.1-2.16-1.25-2.14-3.7c0.01-2.27,1.97-3.1,2.04-3.13c-1.1-1.61-2.81-1.84-3.43-1.86 c-1.46-0.15-2.85,0.86-3.59,0.86c-0.75,0-1.87-0.84-3.09-0.82c-1.6,0.02-3.09,0.94-3.92,2.37C0.5,9.51,0.16,13.37,2.27,16.2 c0.9,1.22,2.01,2.6,3.44,2.55c1.38-0.05,1.9-0.81,3.58-0.81c1.67,0,2.13,0.81,3.6,0.79c1.49-0.02,2.42-1.23,3.31-2.44 C17.41,15.25,16.88,13.73,16.75,13.63z M11.77,3.72c0.64-0.78,1.07-1.88,0.96-2.97c-0.93,0.04-2.07,0.62-2.74,1.39 c-0.6,0.69-1.13,1.8-0.93,2.86C9.97,5.11,11.14,4.51,11.77,3.72z"/>
              </svg>
              <span>Sign up with Apple</span>
            </button>
            {/* Facebook */}
            <button
              onClick={onFacebookRegister}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
            >
              <svg width="20" height="20" fill="#1877F3" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.596 0 0 .592 0 1.326v21.348C0 23.408.596 24 1.326 24h11.495v-9.294H9.692v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.462.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.404 24 24 23.408 24 22.674V1.326C24 .592 23.404 0 22.675 0"/>
              </svg>
              <span>Sign up with Facebook</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-grow border-t border-gray-200" />
          <div className="text-xs text-gray-400 font-semibold">OR USE EMAIL</div>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        {/* Email Register */}
        <form onSubmit={onEmailRegister} className="space-y-3" autoComplete="on">
          {setFullName && (
            <input
              type="text"
              placeholder="Full Name"
              className="input input-bordered w-full"
              autoComplete="name"
              disabled={loading}
              onChange={e => setFullName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            autoComplete="username"
            required
            disabled={loading}
            onChange={e => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full pr-10"
              autoComplete="new-password"
              required
              disabled={loading}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute top-0 right-0 h-full px-3 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
              onClick={() => setShowPassword(s => !s)}
              aria-label="Show password"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={showPassword
                    ? "M13.875 18.825A10.05 10.05 0 0 1 12 19c-5 0-9-6-9-7s4-7 9-7c1.06 0 2.077.202 3.023.563"
                    : "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-1.505 0-2.933-.263-4.192-.74"}
                />
                {showPassword ? null : (
                  <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth={2} />
                )}
              </svg>
            </button>
          </div>
          <button type="submit" className="btn btn-secondary w-full" disabled={loading}>
            Create account
          </button>
        </form>

        {/* Error Message */}
        {error && <div className="mt-3 text-sm text-red-600 text-center">{error}</div>}

        <div className="text-xs text-gray-400 text-center mt-3">
          I agree to EventCurator’s{" "}
          <a href="/terms" className="underline">Terms of Service</a> and{" "}
          <a href="/privacy" className="underline">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
