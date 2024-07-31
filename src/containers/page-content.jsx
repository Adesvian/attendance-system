import Navbar from "./navbar";
import { Route, Routes } from "react-router-dom";
import routes from "../routes";
import { lazy, Suspense } from "react";
import SuspenseContent from "./suspense-content";

const Page404 = lazy(() => import("../pages/protected/404"));

function PageContent() {
  return (
    <>
      <div className="w-full flex flex-col">
        {/* Page content here */}
        <Navbar />
        <div className="flex-1 overflow-y-auto md:pt-4 pt-4 px-6 bg-gray-300 dark:bg-base-300">
          <Suspense fallback={<SuspenseContent />}>
            <Routes>
              {routes.map((route, key) => {
                return (
                  <Route
                    key={key}
                    exact={true}
                    path={`${route.path}`}
                    element={<route.component />}
                  />
                );
              })}

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
