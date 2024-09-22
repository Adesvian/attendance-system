import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/admin/dashboard-admin"));
const DashboardParent = lazy(() =>
  import("../pages/wali-murid/dashboard-parent")
);
const DashboardTeacher = lazy(() => import("../pages/guru/dashboard-teacher"));
const Student = lazy(() => import("../pages/admin/student"));
const ViewStudent = lazy(() => import("../pages/admin/view-student"));
const CreateStudent = lazy(() => import("../pages/admin/create-student"));
const EditStudent = lazy(() => import("../pages/admin/edit-student"));
const Teacher = lazy(() => import("../pages/admin/teacher"));
const ViewTeacher = lazy(() => import("../pages/admin/view-teacher"));
const CreateTeacher = lazy(() => import("../pages/admin/create-teacher"));
const EditTeacher = lazy(() => import("../pages/admin/edit-teacher"));
const Subject = lazy(() => import("../pages/admin/subject"));
const CreateSubject = lazy(() => import("../pages/admin/create-subject"));
const EditSubject = lazy(() => import("../pages/admin/edit-subject"));
const ClassSchedule = lazy(() => import("../pages/admin/class-schedule"));
const CreateClassSchedule = lazy(() =>
  import("../pages/admin/create-class-schedule")
);
const EditClassSchedule = lazy(() =>
  import("../pages/admin/edit-class-schedule")
);
const Permit = lazy(() => import("../pages/guru/permit"));
const CreatePermit = lazy(() => import("../pages/wali-murid/create-permit"));
const RecapAbsensi = lazy(() => import("../pages/recap-absen"));
const LogKehadiran = lazy(() => import("../pages/log-kehadiran"));

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
    component: Student,
  },
  {
    path: "/data-siswa/create-siswa",
    name: "Tambah Siswa",
    role: ["admin"],
    component: CreateStudent,
  },
  {
    path: "/data-siswa/view-siswa/:id",
    name: "Detail Siswa",
    role: ["admin"],
    component: ViewStudent,
  },
  {
    path: "/data-siswa/edit-siswa/:id",
    name: "Edit Siswa",
    role: ["admin"],
    component: EditStudent,
  },
  {
    path: "/teacher",
    name: "Guru",
    role: ["admin"],
    component: Teacher,
  },
  {
    path: "/teacher/view-teacher/:id",
    name: "Detail Guru",
    role: ["admin"],
    component: ViewTeacher,
  },
  {
    path: "/teacher/create-teacher",
    name: "Tambah Guru",
    role: ["admin"],
    component: CreateTeacher,
  },
  {
    path: "/teacher/edit-teacher/:id",
    name: "Edit Teacher",
    role: ["admin"],
    component: EditTeacher,
  },
  {
    path: "/data-mapel",
    name: "Subject",
    role: ["admin"],
    component: Subject,
  },
  {
    path: "/data-mapel/create-mapel",
    name: "Tambah Mapel",
    role: ["admin"],
    component: CreateSubject,
  },
  {
    path: "/data-mapel/edit-mapel/:id",
    name: "Edit Mapel",
    role: ["admin"],
    component: EditSubject,
  },
  {
    path: "/data-jadwal",
    name: "Jadwal Ajar Guru",
    role: ["admin"],
    component: ClassSchedule,
  },
  {
    path: "/data-jadwal/create-jadwal",
    name: "Tambah Jadwal Ajar Guru",
    role: ["admin"],
    component: CreateClassSchedule,
  },
  {
    path: "/data-jadwal/edit-jadwal/:id",
    name: "Edit Jadwal Ajar Guru",
    role: ["admin"],
    component: EditClassSchedule,
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
    role: ["teacher"],
    component: CreatePermit,
  },
];

export default routes;
