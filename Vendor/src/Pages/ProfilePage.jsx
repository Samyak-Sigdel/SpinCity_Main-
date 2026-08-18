// ProfilePage.jsx
import React from "react";
import ProfileForm from "../Components/ProfileForm";

const ProfilePage = () => (
  <div className="flex flex-col items-center">
    <div className="w-full max-w-lg">
      <h2 className="font-serif text-xl text-[#172033] mb-6 text-center">Profile</h2>
      <ProfileForm />
    </div>
  </div>
);

export default ProfilePage;