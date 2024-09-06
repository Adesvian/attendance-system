import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/admin/dashboard-admin"));
const DashboardParent = lazy(() =>
  import("../pages/wali-murid/dashboard-parent")
);
const DashboardTeacher = lazy(() => import("../pages/guru/dashboard-teacher"));
const LogKehadiran = lazy(() => import("../pages/admin/log-kehadiran"));
const Siswa = lazy(() => import("../pages/admin/siswa"));
const Teacher = lazy(() => import("../pages/guru/teacher"));
const CreateTeacher = lazy(() => import("../pages/guru/create-teacher"));
const Subject = lazy(() => import("../pages/admin/subject"));
const ClassSchedule = lazy(() => import("../pages/admin/class-schedule"));
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
    path: "/dashboard-wali-murid",
    name: "Dashboard",
    role: ["parent"],
    component: DashboardParent,
  },
  {
    path: "/dashboard-teacher",
    name: "Dashboard",
    role: ["teacher"],
    component: DashboardTeacher,
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
    component: Teacher,
  },
  {
    path: "/teacher/create-teacher",
    name: "Tambah Guru",
    role: ["admin"],
    component: CreateTeacher,
  },
  {
    path: "/data-mapel",
    name: "Subject",
    role: ["admin"],
    component: Subject,
  },
  {
    path: "/data-jadwal",
    name: "Jadwal Ajar Guru",
    role: ["admin"],
    component: ClassSchedule,
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
