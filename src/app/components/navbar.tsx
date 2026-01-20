"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include", 
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();

      router.replace("/");
    }
  };

  return (
    <header className="bg-[#0B3161] p-4 sticky top-0 z-50">
      <div className="cont-nav">
        <div className="bar flex items-center space-x-2">
          <Image
            src="/filscap.jpg"
            alt="FILSCAP Logo"
            width={50}
            height={50}
          />
          <div className="directory text-white font-semibold justify">
            DSP and Foreign Tracking
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleLogout}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

