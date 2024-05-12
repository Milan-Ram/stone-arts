import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function Erpag() {
  const options = [
    { title: "Invoice", link: "/erpag/Invoice" },
    { title: "Sales Order", link: "/erpag/SalesOrder" },
  ];
  const { logout } = useAuth();
  async function logoutHandler() {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
        <p className="text-2xl text-center">ERPAG Pages</p>
        <button className="bg-red-500 p-3 rounded-lg" onClick={logoutHandler}>
          Logout
        </button>
      </div>

      <div className="flex flex-col text-xl gap-4 items-center mt-8">
        {options.map((option) => (
          <Link
            key={option.link}
            href={option.link}
            className="bg-slate-300 hover:bg-slate-400 p-2 w-full text-center sm:max-w-[25vw]"
          >
            {option.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Erpag;
