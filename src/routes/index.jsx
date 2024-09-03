import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/admin/dashboard-admin"));
const LogKehadiran = lazy(() => import("../pages/admin/log-kehadiran"));
const Siswa = lazy(() => import("../pages/admin/siswa"));
const Guru = lazy(() => import("../pages/guru/teacher"));
const CreateTeacher = lazy(() => import("../pages/guru/create-teacher"));
const RecapAbsensi = lazy(() => import("../pages/admin/recap-absen"));
const Permit = lazy(() => import("../pages/guru/permit"));
const CreatePermit = lazy(() => import("../pages/guru/create-permit"));

const routes = [
  {
    path: "/dashboard-admin",
    name: "Dashboard",
    role: ["admin"],
    component: Dashboard,
  },
  {
    path: "/log-absensi",
    name: "Log Kehadiran",
    role: ["admin", "teacher", "parent"],
    component: LogKehadiran,
  },
  {
    path: "/data-siswa",
    name: "Siswa",
    role: ["admin"],
    component: Siswa,
  },
  {
    path: "/teacher",
    name: "Guru",
    role: ["admin"],
    component: Guru,
  },
  {
    path: "/teacher/create-teacher",
    name: "Tambah Guru",
    role: ["admin"],
    component: CreateTeacher,
  },
  {
    path: "/recapitulation-absensi",
    name: "Rekap Absensi",
    role: ["admin", "teacher", "parent"],
    component: RecapAbsensi,
  },
  {
    path: "/permit",
    name: "Ketidakhadiran",
    role: ["teacher"],
    component: Permit,
  },
  {
    path: "/permit/create-permit",
    name: "Tambah Permit",
    role: ["parent"],
    component: CreatePermit,
  },
];

export default routes;
