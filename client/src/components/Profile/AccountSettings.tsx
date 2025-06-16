import { useState } from "react";
import { auth } from "../../firebase";
import { updatePassword, deleteUser } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ✅ React Icons

export default function AccountSettings() {
  const user = auth.currentUser;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const handlePasswordUpdate = async () => {
    if (!user || !newPassword || newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(user, newPassword);
      setMessage("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update password. Please re-authenticate.");
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await deleteUser(user);
      setMessage("Account deleted successfully!");
      setShowDeleteModal(false);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete account. Please re-authenticate.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Removed Change Email section */}
      <div>
        <h2 className="text-xl font-bold mb-2">Change Password</h2>
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="input input-bordered w-full pr-10"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>

        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            className="input input-bordered w-full pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handlePasswordUpdate}
          disabled={
            loading ||
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
          }
        >
          Update Password
        </button>
        {newPassword !== confirmPassword && newPassword && confirmPassword && (
          <p className="text-red-500 text-sm mt-2">Passwords do not match.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Delete Account</h2>
        <button
          className="btn btn-outline btn-error"
          onClick={() => setShowDeleteModal(true)}
          disabled={loading}
        >
          Delete
        </button>
      </div>

      {message && (
        <div className="alert alert-info mt-4">
          {message}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-full max-w-md">
            <h3 className="text-lg font-bold text-red-600">Confirm Account Deletion</h3>
            <p className="text-gray-700">Are you sure you want to delete your account? This action is irreversible.</p>
            <div className="flex justify-end gap-4">
              <button
                className="btn btn-outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}