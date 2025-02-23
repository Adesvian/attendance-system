import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../redux/headerSlice";
import TextInput from "../components/input/TextInput";
import SingleButton from "../components/button/Button";
import { updatePassword } from "../app/api/v1/parent-services";

function UserProfile() {
  const dispatch = useDispatch();
  const teacher_user = useSelector((state) => state.auth.teacher);
  const parent_user = useSelector((state) => state.auth.parent);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    dispatch(setPageTitle({ title: "User Profile" }));
  }, [dispatch]);

  const handleSave = async (e) => {
    e.preventDefault();

    updatePassword(
      password,
      confirmPassword,
      parent_user,
      teacher_user,
      setPassword,
      setConfirmPassword
    );
  };

  // Render the profile details if parent_user or teacher_user is available
  const user = parent_user || teacher_user;

  if (!user) {
    return <div>User not found.</div>; // Or redirect to a different page
  }

  // Function to format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className="p-4 sm:p-8 font-poppins flex flex-col lg:flex-row items-center lg:items-start"
      data-testid="user-profile-element"
    >
      <img
        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 drop-shadow-md mb-4 lg:mb-0 lg:mr-8"
        src="./assets/user-profile.png"
        alt="User Avatar"
      />

      <div className="flex flex-col w-full">
        <form className="grid gap-y-4" onSubmit={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* NIK Field */}
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="nid"
              >
                NIK:
              </label>
              <input
                id="nid"
                type="text"
                value={user.nid || "-"}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Name Field */}
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="name"
              >
                Nama:
              </label>
              <input
                id="name"
                type="text"
                value={user.name || "-"}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Gender Field */}
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="gender"
              >
                Jenis Kelamin:
              </label>
              <input
                id="gender"
                type="text"
                value={user.gender || "-"}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Birth Date and Place */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="birth_of_date"
              >
                Tanggal Lahir:
              </label>
              <input
                id="birth_of_date"
                type="text"
                value={formatDate(user.birth_of_date) || "-"}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="birth_of_place"
              >
                Tempat Lahir:
              </label>
              <input
                id="birth_of_place"
                type="text"
                value={user.birth_of_place || "-"}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Address and Phone Number */}
          <div
            className={`grid grid-cols-1 ${
              teacher_user ? "md:grid-cols-1" : "md:grid-cols-2"
            } gap-4`}
          >
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="address"
              >
                Alamat:
              </label>
              <input
                id="address"
                type="text"
                value={user.address || "-"}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            {!teacher_user && (
              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 mb-1"
                  htmlFor="phone_num"
                >
                  Nomor Telepon:
                </label>
                <input
                  id="phone_num"
                  type="text"
                  value={user.phone_num || "-"}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-4">
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="password"
              >
                Password:
              </label>
              <TextInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded dark:text-dark-text bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="confirm_password"
              >
                Konfirmasi Password:
              </label>
              <TextInput
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded dark:text-dark-text bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="lg:mt-4">
            <SingleButton
              type="submit"
              disabled={
                !password ||
                !confirmPassword ||
                password.length < 6 ||
                confirmPassword.length < 6
              }
              className={`float-end p-2 rounded ${
                !password || !confirmPassword
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white w-full sm:w-auto`}
            >
              Save
            </SingleButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
