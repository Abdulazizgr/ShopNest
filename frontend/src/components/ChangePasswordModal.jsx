import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { Eye, EyeOff } from "lucide-react"; // Replaced react-icons with lucide-react

const ChangePasswordModal = ({ onClose }) => {
  const { backendUrl, token } = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isMatching, setIsMatching] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Update isMatching whenever passwords change
  useEffect(() => {
    if (password.newPassword && password.confirmPassword) {
      setIsMatching(password.newPassword !== password.confirmPassword);
    } else {
      setIsMatching(null);
    }
  }, [password.newPassword, password.confirmPassword]);

  // Focus on first input when modal opens
  useEffect(() => {
    document.getElementById("oldPassword").focus();
  }, []);

  const handleChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      !password.oldPassword ||
      !password.newPassword ||
      !password.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      setIsMatching(true);
      toast.error("New passwords do not match");
      return;
    }

    if (password.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/changePassword`,
        {
          oldPassword: password.oldPassword,
          newPassword: password.newPassword,
        },
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Password changed successfully!");
        onClose();
      } else {
        toast.error(response.data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while changing password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setIsMatching(null);
    setShowPasswords({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="change-password-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-md p-6 w-full max-w-xs sm:max-w-sm space-y-4">
        <h2
          id="change-password-title"
          className="text-xl font-semibold text-gray-800 mb-2"
        >
          Change Password
        </h2>
        <div className="flex flex-col">
          <label
            htmlFor="oldPassword"
            className="text-sm font-medium text-gray-700"
          >
            Old Password
          </label>
          <div className="relative">
            <input
              id="oldPassword"
              name="oldPassword"
              type={showPasswords.oldPassword ? "text" : "password"}
              value={password.oldPassword}
              onChange={handleChange}
              placeholder="Old Password"
              className="w-full border border-gray-800 px-3 py-2 rounded"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("oldPassword")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              aria-label={
                showPasswords.oldPassword
                  ? "Hide old password"
                  : "Show old password"
              }
            >
              {showPasswords.oldPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="newPassword"
            className="text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showPasswords.newPassword ? "text" : "password"}
              value={password.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full border border-gray-800 px-3 py-2 rounded"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              aria-label={
                showPasswords.newPassword
                  ? "Hide new password"
                  : "Show new password"
              }
            >
              {showPasswords.newPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords.confirmPassword ? "text" : "password"}
              value={password.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
              className="w-full border border-gray-800 px-3 py-2 rounded"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirmPassword")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              aria-label={
                showPasswords.confirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showPasswords.confirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>
        {isMatching && (
          <p className="text-red-500 text-sm">New passwords do not match</p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-all rounded"
            aria-label="Cancel password change"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-4 py-2 rounded text-white ${
              isLoading ? "bg-gray-500" : "bg-black hover:bg-gray-800"
            }`}
            aria-label="Save new password"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
