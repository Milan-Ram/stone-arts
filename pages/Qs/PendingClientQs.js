import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PendingClientQs() {
  const router = useRouter();

  const [Measurements, setMeasurements] = useState([]);
  const [originalMeasurements, setOriginalMeasurements] = useState([]);

  const params = useSearchParams();
  var dbName = params.get("param");
  if (dbName.endsWith("pending-measurements")) {
    //remove pending-Measurements from dbName
    dbName = dbName.slice(0, -21);
  }

  useEffect(() => {
    const MeasurementsRef = collection(db, dbName);
    const MeasurementsSnapshot = onSnapshot(MeasurementsRef, (snapshot) => {
      const MeasurementsList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      MeasurementsList.forEach((qs) => (qs.infoChecked = false));
      setMeasurements(MeasurementsList);
      setOriginalMeasurements(MeasurementsList);
    });
  }, []);

  const [search, setSearch] = useState("");
  const handleSearch = () => {
    //name or id
    setMeasurements(
      originalMeasurements.filter((qs) => {
        var searchParam = search.toLowerCase();
        return (
          qs.name.toLowerCase().includes(searchParam) ||
          qs.id.toString().includes(searchParam)
        );
      })
    );
  };

  async function handleAdminAprove(qsId) {
    const qsData = Measurements.find((qs) => qs.id === qsId);
    await setDoc(
      doc(db, dbName.slice(0, 3) + "-completed-quotes", qsId),
      qsData
    );
    await deleteDoc(doc(db, dbName, qsId));
    alert(`Project ${qsId} Accepted By  Client `);
  }
  async function handleAdminReject(qsId) {
    const qsData = Measurements.find((qs) => qs.id === qsId);
    await setDoc(
      doc(db, dbName.slice(0, 3) + "-rejected-quotes", qsId),
      qsData
    );
    await deleteDoc(doc(db, dbName, qsId));
    alert(`Project ${qsId} Rejected By  Client `);
  }

  return (
    <div>
      <div className="w-full px-8 flex flex-row justify-between">
        <button
          className="bg-slate-300 p-2 rounded-lg"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-12 my-4">
        <p className="my-4 text-3xl text-center">Pending Client Qoutes</p>
      </div>
      <div className="flex flex-col gap-4 my-4 ">
        <div className="mx-auto">
          <input
            onChange={(e) => setSearch(e.target.value)}
            className="mx-auto border-2 border-black p-2"
          />
          <buttonq
            className="bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2"
            onClick={handleSearch}
          >
            Search
          </buttonq>
          <div className="bg-slate-300">
            {search &&
              originalMeasurements
                .filter((qs) => {
                  var searchParam = search.toLowerCase();
                  return (
                    qs.name.toLowerCase().includes(searchParam) ||
                    qs.id.toString().includes(searchParam)
                  );
                })
                .slice(0, 10)
                .map((qs) => (
                  <p
                    key={qs.id}
                    onClick={() => {
                      setSearch(qs.name);
                      handleSearch();
                    }}
                    className="p-2 text-black cursor-pointer"
                  >
                    {qs.id} : {qs.name}
                  </p>
                ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 mt-8 items-center">
        {Measurements.map((qs) => (
          <div
            key={qs["id"]}
            className=" w-[70%] grid grid-cols-4 items-center"
          >
            <p className=" text-center">
              {qs["name"]} - {qs["id"]} :
            </p>
            <Link
              href={qs.downloadURL}
              className="bg-gray-400 p-2 rounded-md mr-3 text-center"
              target="_blank"
            >
              View
            </Link>
            <button
              className={` bg-gray-400 hover:bg-green-400 p-2 rounded-md cursor-pointer `}
              onClick={() => handleAdminAprove(qs.id)}
            >
              Approve
            </button>
            <button
              className={` bg-gray-400 hover:bg-red-400 ml-3 p-2 rounded-md cursor-pointer `}
              onClick={() => handleAdminReject(qs.id)}
            >
              Reject
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
