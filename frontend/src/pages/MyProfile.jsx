import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChangePasswordModal from "../components/ChangePasswordModal";

const MyProfile = () => {
  const { token, backendUrl, navigate } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/user/my-profile`,
          {},
          {
            headers: { token },
          }
        );
        console.log(response.data);
        const data = response.data;
        if (data.success) {
          setProfile(data.user);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/editProfile`,
        {
          ...profile,
        },
        {
          headers: { token },
        }
      );
      const data = response.data;
      if (data.success) {
        toast.success("Profile updated successfully");
        setProfile(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
    navigate("/my-profile");
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-start ">
      {/* Profile Content */}
      <div className="mt-10 w-full max-w-xl ">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 ">My Profile</h2>

        <div className="space-y-4">
          {/* First Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              className="w-full border border-gray-800 px-3 py-2 "
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              className="w-full border border-gray-800 px-3 py-2 "
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full border border-gray-800 px-3 py-2 "
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full border border-gray-800 px-3 py-2 "
              placeholder="e.g., +1234567890"
            />
          </div>
        </div>
        {visible && <ChangePasswordModal onClose={() => setVisible(false)} />}

        {/* Edit/Save Buttons */}
        <div className="mt-6 flex  justify-start gap-4">
          <button
            onClick={handleSave}
            className="bg-black text-white font-light px-8 py-2 "
          >
            Save
          </button>

          <button
            onClick={() => setVisible(true)}
            className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
