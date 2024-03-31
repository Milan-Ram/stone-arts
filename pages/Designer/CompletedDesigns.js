import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDocs,
  setDoc,
  docRef,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CompletedDesigns() {
  const router = useRouter();

  const [designs, setDesigns] = useState([]);
  const [originalDesigns, setOriginalDesigns] = useState([]);

  const params = useSearchParams();
  const dbName = params.get("param");

  useEffect(() => {
    const designsRef = collection(db, dbName);
    const designsSnapshot = onSnapshot(designsRef, (snapshot) => {
      const designsList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      designsList.forEach((design) => (design.infoChecked = false));
      setDesigns(designsList);
      setOriginalDesigns(designsList);
    });
  }, []);
  const [search, setSearch] = useState("");
  const handleSearch = () => {
    //name or id
    setDesigns(
      originalDesigns.filter((design) => {
        var searchParam = search.toLowerCase();
        return (
          design.name.toLowerCase().includes(searchParam) ||
          design.id.toString().includes(searchParam)
        );
      })
    );
  };

  const handleCheckInfo = (designId) => {
    const updatedDesigns = designs.map((design) => {
      if (design.id === designId) {
        return { ...design, infoChecked: true };
      }
      return design;
    });
    setDesigns(updatedDesigns);
  };

  const handleCheckDesign = async (designId) => {
    const designData = designs.find((design) => design.id === designId);
    window.open(designData.downloadURL);
  };

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
        <p className="my-4 text-3xl text-center">Completed Designs</p>
      </div>
      <div className="flex flex-col gap-4 my-4 ">
        <div className="mx-auto">
          <input
            onChange={(e) => setSearch(e.target.value)}
            className="mx-auto border-2 border-black p-2"
          />
          <button
            className="bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2"
            onClick={handleSearch}
          >
            Search
          </button>
          <div className="bg-slate-300">
            {search &&
              originalDesigns
                .filter((design) => {
                  var searchParam = search.toLowerCase();
                  return (
                    design.name.toLowerCase().includes(searchParam) ||
                    design.id.toString().includes(searchParam)
                  );
                })
                .slice(0, 10)
                .map((design) => (
                  <p
                    key={design.id}
                    onClick={() => {
                      setSearch(design.name);
                      handleSearch();
                    }}
                    className="p-2 text-black cursor-pointer"
                  >
                    {design.id} : {design.name}
                  </p>
                ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-8 items-center">
        {designs.map((design) => (
          <div
            key={design["id"]}
            className="grid grid-cols-4 gap-4 items-center"
          >
            <p className=" text-center">
              {design["name"]} - {design["id"]} :
            </p>
            <button
              onClick={() => handleCheckDesign(design.id)} // Attach onClick event here
              className="bg-green-400 p-2 rounded-lg text-center"
            >
              Check Design
            </button>

            <Link
              href={{
                pathname: "/RequestDetails",
                query: {
                  title: design["title"],
                  id: design["id"],
                  name: design["name"],
                  description: design["description"],
                  clientFirstName: design["clientFirstName"],
                  clientLastName: design["clientLastName"],
                  clientPhoneNumber: design["clientPhoneNumber"],
                  clientEmail: design["clientEmail"],
                  clientAddress: design["clientAddress"],
                  downloadURL: design["downloadURL"],
                  notes: design["notes"],
                  imageUrl: design["imageUrl"],
                },
              }}
              className="bg-green-400 p-2 rounded-lg text-center"
              target="_blank"
            >
              <button
                onClick={() => handleCheckInfo(design.id)} // Attach onClick event here
              >
                Check Info
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
