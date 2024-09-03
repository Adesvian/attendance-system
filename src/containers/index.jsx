import React, { Suspense, lazy } from "react";
import SuspenseContent from "./suspense-content";

// Lazy load components
const LeftSidebar = lazy(() => import("./left-sidebar"));
const PageContent = lazy(() => import("./page-content"));

function Layout() {
  return (
    <div className="flex">
      <Suspense fallback={<SuspenseContent />}>
        <LeftSidebar />
        <PageContent />
      </Suspense>
    </div>
  );
}

export default Layout;
