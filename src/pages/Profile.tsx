import React from "react";
import { useAuth } from "../context/AuthContext";

// Define the UserProfile type
interface UserProfile {
  name: string;
  email: string;
  role: string;
  username: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();

  // Check if the user is logged in
  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  // Type assertion to safely access `profile`
  const userProfile = user.profile as unknown as UserProfile;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="space-y-4">
        <p>
          <strong>Name:</strong> {userProfile.name}
        </p>
        <p>
          <strong>Email:</strong> {userProfile.email}
        </p>
        <p>
          <strong>Role:</strong> {userProfile.role}
        </p>
        <p>
          <strong>Username:</strong> {userProfile.username}
        </p>
      </div>

      <div className="mt-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          onClick={() => alert("Edit Profile functionality goes here")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
