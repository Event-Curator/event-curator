//import { useState } from "react";
import AccountSettings from "../components/Profile/AccountSettings";

export default function ProfileSettings() {

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Account Settings</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-1/4">
          <ul className="space-y-2">
            <li>
              <button
                className="btn btn-block btn-primary"
                disabled
              >
                Account Settings
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <section className="flex-1 bg-white p-6 rounded-xl shadow">
          <AccountSettings />
        </section>
      </div>
    </main>
  );
}