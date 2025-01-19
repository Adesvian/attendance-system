import { HiOutlineSquares2X2, HiOutlineClipboard } from "react-icons/hi2";
import {
  PiStudent,
  PiUser,
  PiWhatsappLogoLight,
  PiTimerLight,
  PiBook,
} from "react-icons/pi";
import {
  LiaClipboardListSolid,
  LiaClipboardCheckSolid,
  LiaDatabaseSolid,
  LiaEnvelopeOpenTextSolid,
} from "react-icons/lia";
import { GrSchedules } from "react-icons/gr";
import { IoCalendarOutline, IoLogoBuffer } from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const sidebar_routes = [
  {
    path: "/dashboard-admin",
    name: "Dashboard",
    role: ["admin"],
    icon: <HiOutlineSquares2X2 className={iconClasses} />,
  },
  {
    path: "/dashboard-teacher",
    name: "Dashboard",
    role: ["teacher"],
    icon: <HiOutlineSquares2X2 className={iconClasses} />,
  },
  {
    path: "/dashboard-wali-murid",
    name: "Dashboard",
    role: ["parent"],
    icon: <HiOutlineSquares2X2 className={iconClasses} />,
  },
  {
    path: "/schedule-teacher",
    name: "Jadwal Mengajar",
    role: ["teacher"],
    icon: <IoCalendarOutline className={iconClasses} />,
  },

  {
    path: "/permit",
    name: "Ketidakhadiran",
    role: ["teacher", "parent"],
    icon: <LiaEnvelopeOpenTextSolid className={iconClasses} />,
  },
  {
    path: "",
    icon: <HiOutlineClipboard className={iconClasses} />,
    name: "Absensi",
    role: ["admin", "teacher", "parent"],
    submenu: [
      {
        path: "/recapitulation-absensi",
        name: "Rekapitulasi Absensi",
        icon: <LiaClipboardCheckSolid className={iconClasses} />,
      },
      {
        path: "/log-absensi",
        name: "Log Absensi",
        icon: <LiaClipboardListSolid className={iconClasses} />,
      },
    ],
  },
  {
    path: "",
    name: "Manajemen Data",
    role: ["admin"],
    icon: <LiaDatabaseSolid className={`${iconClasses} inline`} />,
    submenu: [
      {
        path: "/teacher",
        name: "Manajemen Data Guru",
        icon: <PiUser className={submenuIconClasses} />,
      },
      {
        path: "/data-siswa",
        name: "Manajemen Data Siswa",
        icon: <PiStudent className={submenuIconClasses} />,
      },
      {
        path: "/data-mapel",
        name: "Manajemen Data Mapel",
        icon: <PiBook className={submenuIconClasses} />,
      },
      {
        path: "/data-jadwal",
        name: "Manajemen Data Jadwal",
        icon: <GrSchedules className={submenuIconClasses} />,
      },
      {
        path: "/holidays",
        name: "Manajemen Events",
        icon: <CiCalendarDate className={iconClasses} />,
      },
    ],
  },
  {
    path: "/whatsapp-configuration",
    name: "Whatsapp Configuration",
    role: ["admin"],
    icon: <PiWhatsappLogoLight className={iconClasses} />,
  },
  {
    path: "/time-setting",
    name: "Time Setting",
    role: ["admin"],
    icon: <PiTimerLight className={iconClasses} />,
  },
  {
    path: "/logs-system",
    name: "Log Sistem",
    role: ["admin"],
    icon: <IoLogoBuffer className={iconClasses} />,
  },
];

export default sidebar_routes;
