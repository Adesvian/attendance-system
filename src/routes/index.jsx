import Dashboard from "../pages/dashboard";
import Siswa from "../pages/siswa";
import Guru from "../pages/guru";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/siswa",
    name: "Siswa",
    component: Siswa,
  },
  {
    path: "/guru",
    name: "Guru",
    component: Guru,
  },
];

export default routes;
