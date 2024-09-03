import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCookies } from "../redux/authSlice";

function ProtectedRoute() {
  const dispatch = useDispatch();
  const [cookies, setCookies] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCookies = async () => {
      try {
        const result = await dispatch(fetchCookies()).unwrap();

        // Cek apakah cookies adalah objek kosong
        if (result && Object.keys(result).length > 0) {
          setCookies(result);
        } else {
          setCookies(false); // Set cookies menjadi false jika objek kosong
        }
      } catch (error) {
        console.error("Error fetching cookies:", error);
        setCookies(false); // Set cookies menjadi false jika terjadi error
      } finally {
        setLoading(false); // Set loading menjadi false setelah fetch selesai
      }
    };

    getCookies();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Cek apakah cookies bernilai false (kosong) atau ada isinya
  return cookies ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
