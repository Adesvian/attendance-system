import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  fetchCookies,
  fetchParentData,
  fetchTeacherData,
} from "../redux/authSlice";
import { decodeJWT } from "../app/api/v1/auth";
import SuspenseContent from "../containers/suspense-content";

function ProtectedRoute() {
  const dispatch = useDispatch();
  const [cookies, setCookies] = useState(null);
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCookies = async () => {
      try {
        const result = await dispatch(fetchCookies()).unwrap();

        // Cek apakah cookies adalah objek kosong
        if (result && Object.keys(result).length > 0) {
          setCookies(result);
          if (decodeJWT(result).role !== "admin") {
            const { role, nid } = decodeJWT(result);
            if (role === "teacher") {
              try {
                const teacherResult = await dispatch(
                  fetchTeacherData(nid)
                ).unwrap();
                if (teacherResult && Object.keys(teacherResult).length > 0) {
                  setAuth(teacherResult);
                } else {
                  setAuth(false);
                }
              } catch (error) {
                console.error("Error fetching teacher data:", error);
                setAuth(false);
              }
            } else {
              const parentResult = await dispatch(
                fetchParentData(nid)
              ).unwrap();
              if (parentResult && Object.keys(parentResult).length > 0) {
                setAuth(parentResult);
              } else {
                setAuth(false);
              }
            }
          } else {
            setAuth(false);
          }
        } else {
          setCookies(false);
        }
      } catch (error) {
        console.error("Error fetching cookies:", error);
        setCookies(false);
      } finally {
        setLoading(false);
      }
    };

    getCookies();
  }, [dispatch]);

  if (loading) {
    return <SuspenseContent />;
  }

  // Cek apakah cookies bernilai false (kosong) atau ada isinya
  return cookies ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
