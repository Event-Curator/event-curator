import { Link, useNavigate } from "react-router";
import userLogo from "../assets/userlogo.png";
import type { User } from "firebase/auth";

type UserDropDownProps = {
  user: User;
  avatarUrl: string;
  isGoogleUser: boolean;
  handleLogout: () => void;
};

export default function UserDropDown({
  user,
  avatarUrl,
  isGoogleUser,
  handleLogout,
}: UserDropDownProps) {
  const navigate = useNavigate();

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-12 h-12">
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
            <div className="w-12 h-12">
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
  );
}
