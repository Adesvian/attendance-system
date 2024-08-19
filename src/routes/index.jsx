import Dashboard from "../pages/admin/dashboard-admin";
import Siswa from "../pages/admin/siswa";
import Guru from "../pages/admin/guru";
import RecapAbsensi from "../pages/admin/recap-absen";
import LogKehadiran from "../pages/admin/log-kehadiran";

const routes = [
  {
    path: "/dashboard-admin",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/log-absensi",
    name: "Log Kehadiran",
    component: LogKehadiran,
  },
  {
    path: "/data-siswa",
    name: "Siswa",
    component: Siswa,
  },
  {
    path: "/data-guru",
    name: "Guru",
    component: Guru,
  },
  {
    path: "/recapitulation-absensi",
    name: "Rekap Absensi",
    component: RecapAbsensi,
  },
];

export default routes;
