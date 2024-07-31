import LeftSidebar from "./left-sidebar";
import PageContent from "./page-content";

function Layout() {
  return (
    <div className="flex">
      <LeftSidebar />
      <PageContent />
    </div>
  );
}

export default Layout;
