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
} from "react-icons/pi";
import { LiaClipboardListSolid, LiaClipboardCheckSolid } from "react-icons/lia";

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
    path: "",
    icon: <PiStudent className={`${iconClasses} inline`} />,
    name: "Manajemen Siswa",
    submenu: [
      {
        path: "/tambah-siswa",
        name: "Tambah Data Siswa",
        icon: <HiOutlineUserAdd className={submenuIconClasses} />,
      },
      {
        path: "/show-siswa",
        name: "Table Data Siswa",
        icon: <HiOutlineTableCells className={submenuIconClasses} />,
      },
    ],
  },
  {
    path: "/guru",
    name: "Manajemen Guru",
    icon: <PiUser className={`${iconClasses} inline`} />,
    submenu: [
      {
        path: "/tambah-guru",
        name: "Tambah Data Guru",
        icon: <HiOutlineUserAdd className={submenuIconClasses} />,
      },
      {
        path: "/show-guru",
        name: "Table Data Guru",
        icon: <HiOutlineTableCells className={submenuIconClasses} />,
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
