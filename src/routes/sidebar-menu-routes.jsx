import {
  HiOutlineSquares2X2,
  HiOutlineClipboard,
  HiOutlineTableCells,
} from "react-icons/hi2";
import { HiOutlineUserAdd } from "react-icons/hi";
import {
  PiStudent,
  PiUser,
  PiWhatsappLogoLight,
  PiTimerLight,
  PiUserCircleMinus,
  PiBook,
} from "react-icons/pi";
import {
  LiaClipboardListSolid,
  LiaClipboardCheckSolid,
  LiaDatabaseSolid,
} from "react-icons/lia";
import { GrSchedules } from "react-icons/gr";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const sidebar_routes = [
  {
    path: "/dashboard-admin",
    name: "Dashboard",
    icon: <HiOutlineSquares2X2 className={iconClasses} />,
  },
  {
    path: "/absence",
    name: "Ketidakhadiran",
    icon: <PiUserCircleMinus className={iconClasses} />,
  },
  {
    path: "",
    icon: <HiOutlineClipboard className={iconClasses} />,
    name: "Absensi",
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
    path: "/master-data",
    name: "Manajemen Data",
    icon: <LiaDatabaseSolid className={`${iconClasses} inline`} />,
    submenu: [
      {
        path: "/data-guru",
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
    ],
  },
  {
    path: "/whatsapp",
    name: "Whatsapp Configuration",
    icon: <PiWhatsappLogoLight className={iconClasses} />,
  },
  {
    path: "/time-setting",
    name: "Time Setting",
    icon: <PiTimerLight className={iconClasses} />,
  },
];

export default sidebar_routes;
