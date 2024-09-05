import Navbar from "./navbar";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import routes from "../routes";
import { lazy, Suspense, useEffect } from "react";
import SuspenseContent from "./suspense-content";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { fetchCookies } from "../redux/authSlice";
import { decodeJWT } from "../app/auth";

const Page404 = lazy(() => import("../pages/utils/404"));

function PageContent() {
  const user = useSelector((state) => state.auth.token);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filteredRoutes = routes.filter((route) =>
    route.role.includes(decodeJWT(user).role)
  );

  useEffect(() => {
    const checkSession = async () => {
      try {
        const cookies = await dispatch(fetchCookies()).unwrap();

        if (!cookies || Object.keys(cookies).length === 0) {
          Swal.fire({
            title: "Your session has expired. \n Please login again.",
            width: 600,
            padding: "3em",
            color: "#fff",
            background:
              "#fff url(https://static.vecteezy.com/system/resources/previews/042/056/318/non_2x/8bit-pixel-art-night-sky-game-space-landscape-vector.jpg) no-repeat center center / cover",
            backdrop: `
              rgba(0,0,123,0.4)
            `,
            html: `
                <img src="/assets/icon/waiting-pixel.gif" class="w-48 h-auto ml-7 lg:ml-36" />
            `,
          }).then(() => {
            navigate("/login", { replace: true });
          });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        // Handle error (optional)
      }
    };

    checkSession();
  }, [location, dispatch, navigate]);
  return (
    <>
      <div className="w-full lg:flex-1 overflow-y-auto h-screen ">
        <Navbar />
        <div className="flex-1 overflow-y-auto md:pt-4 pt-4 px-6 bg-gray-300 dark:bg-base-300">
          <Suspense fallback={<SuspenseContent />}>
            <Routes>
              {filteredRoutes.map((route, key) => (
                <Route
                  key={key}
                  path={route.path}
                  element={<route.component />}
                />
              ))}

              {/* Redirecting unknown url to 404 page */}
              <Route path="*" element={<Page404 />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default PageContent;
