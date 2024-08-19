import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import { Button } from "@mui/material";
import { MdOutlineAdd } from "react-icons/md";
import TableDataManager from "../../components/table/table"; // Pastikan nama file dan path sudah benar

function Guru() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const logRecords = [
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/6/6b/Tokino_Sora_-_Portrait_06-1-1.png/420px-Tokino_Sora_-_Portrait_06-1-1.png",
      nik: "0001",
      name: "Tokino Sora",
      type: "Hololive 0th Generation",
      focus: "0 Genth C1",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/7/7e/Roboco_-_Portrait_01-1.png/435px-Roboco_-_Portrait_01-1.png",
      nik: "0002",
      name: "Roboco",
      type: "Hololive 0th Generation",
      focus: "0 Genth C2",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/f/f9/AZKi_-_Portrait_04.png",
      nik: "0003",
      name: "AZKi",
      type: "Hololive 0th Generation",
      focus: "0 Genth C3",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/5/51/Sakura_Miko_-_Portrait_3D_03.png/420px-Sakura_Miko_-_Portrait_3D_03.png",
      nik: "0004",
      name: "Sakura Miko",
      type: "Hololive 0th Generation",
      focus: "0 Genth C4",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/1/1f/Hoshimachi_Suisei_-_Portrait_04.png/420px-Hoshimachi_Suisei_-_Portrait_04.png",
      nik: "0005",
      name: "Hoshimachi Suisei",
      type: "Hololive 0th Generation",
      focus: "0 Genth C5",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/c/c6/Shirakami_Fubuki_-_Portrait_01.png/435px-Shirakami_Fubuki_-_Portrait_01.png",
      nik: "0006",
      name: "Shirakami Fubuki",
      type: "Hololive 1st Generation",
      focus: "1 Genth C1",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/e/e2/Natsuiro_Matsuri_-_Portrait_01.png/435px-Natsuiro_Matsuri_-_Portrait_01.png",
      nik: "0007",
      name: "Natsuiro Matsuri",
      type: "Hololive 1st Generation",
      focus: "1 Genth C2",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/b/b5/Aki_Rosenthal_-_Portrait_01.png/435px-Aki_Rosenthal_-_Portrait_01.png",
      nik: "0008",
      name: "Aki Rosenthal",
      type: "Hololive 1st Generation",
      focus: "1 Genth C3",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/8/81/Akai_Haato_-_Portrait_01-1.png/435px-Akai_Haato_-_Portrait_01-1.png",
      nik: "0009",
      name: "Akai Haato",
      type: "Hololive 1st Generation",
      focus: "1 Genth C4",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/6/6d/Minato_Aqua_-_Portrait_01.png/435px-Minato_Aqua_-_Portrait_01.png",
      nik: "00010",
      name: "Minato Aqua",
      type: "Hololive 2nd Generation",
      focus: "2 Genth C1",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/a/ae/Murasaki_Shion_-_Portrait_01.png/434px-Murasaki_Shion_-_Portrait_01.png",
      nik: "00011",
      name: "Murasaki Shion",
      type: "Hololive 2nd Generation",
      focus: "2 Genth C2",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/4/40/Nakiri_Ayame_-_Portrait_01.png/435px-Nakiri_Ayame_-_Portrait_01.png",
      nik: "00012",
      name: "Nakiri Ayame",
      type: "Hololive 2nd Generation",
      focus: "2 Genth C3",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/a/a7/Yuzuki_Choco_-_Portrait_01.png/435px-Yuzuki_Choco_-_Portrait_01.png",
      nik: "00013",
      name: "Yuzuki Choco",
      type: "Hololive 2nd Generation",
      focus: "2 Genth C4",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/1/12/Oozora_Subaru_-_Portrait_01.png/435px-Oozora_Subaru_-_Portrait_01.png",
      nik: "00014",
      name: "Oozora Subaru",
      type: "Hololive 2nd Generation",
      focus: "2 Genth C5",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/e/e6/Shirakami_Fubuki_-_Portrait_05.png/435px-Shirakami_Fubuki_-_Portrait_05.png",
      nik: "00015",
      name: "Shirakami Fubuki",
      type: "hololive GAMERS",
      focus: "Gamers C1",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/4/44/Ookami_Mio_-_Portrait_01.png/435px-Ookami_Mio_-_Portrait_01.png",
      nik: "00016",
      name: "Ookami Mio",
      type: "hololive GAMERS",
      focus: "Gamers C2",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/1/14/Nekomata_Okayu_-_Portrait_03.png/435px-Nekomata_Okayu_-_Portrait_03.png",
      nik: "00017",
      name: "Nekomata Okayu",
      type: "hololive GAMERS",
      focus: "Gamers C3",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/f/fe/Inugami_Korone_-_Portrait_04.png/435px-Inugami_Korone_-_Portrait_04.png",
      nik: "00018",
      name: "Inugami Korone",
      type: "hololive GAMERS",
      focus: "Gamers C4",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/d/d0/Usada_Pekora_-_Portrait_01.png/435px-Usada_Pekora_-_Portrait_01.png",
      nik: "00019",
      name: "Usada Pekora",
      type: "Hololive 3rd Generation: Hololive Fantasy",
      focus: "3 Genth C1",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/1/1b/Shiranui_Flare_-_Portrait_01.png/435px-Shiranui_Flare_-_Portrait_01.png",
      nik: "00020",
      name: "Shiranui Flare",
      type: "Hololive 3rd Generation: Hololive Fantasy",
      focus: "3 Genth C2",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/8/8c/Shirogane_Noel_-_Portrait_01.png/435px-Shirogane_Noel_-_Portrait_01.png",
      nik: "00021",
      name: "Shirogane Noel",
      type: "Hololive 3rd Generation: Hololive Fantasy",
      focus: "3 Genth C3",
    },
    {
      profile:
        "https://static.miraheze.org/hololivewiki/thumb/c/cb/Houshou_Marine_-_Portrait_01.png/435px-Houshou_Marine_-_Portrait_01.png",
      nik: "00022",
      name: "Houshou Marine",
      type: "Hololive 3rd Generation: Hololive Fantasy",
      focus: "3 Genth C4",
    },
  ];

  const handleEdit = (row) => {
    console.log("Edit clicked for: ", row);
    // Implementasi logika edit di sini
  };

  // Definisikan fungsi handleDelete
  const handleDelete = (row) => {
    console.log("Delete clicked for: ", row);
    // Implementasi logika hapus di sini
  };

  useEffect(() => {
    setData(logRecords);
    setColumns([
      { field: "profile", header: "Profile" },
      { field: "nik", header: "NIK" },
      { field: "name", header: "Name" },
      { field: "type", header: "Type" },
      { field: "focus", header: "Focus" },
      { field: "action", header: "Action" },
    ]);
    dispatch(setPageTitle({ title: "Guru" }));
  }, [dispatch]);

  return (
    <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-6 mt-5">
      <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-4">
        <div className="flex lg:justify-end">
          <Button
            variant="contained"
            className="dark:bg-indigo-700 lg:flex-none flex-auto whitespace-nowrap"
            startIcon={<MdOutlineAdd />}
          >
            Tambah Data Guru
          </Button>
        </div>

        <TableDataManager
          data={data}
          columns={columns}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default Guru;
