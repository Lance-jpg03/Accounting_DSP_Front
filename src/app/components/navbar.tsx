// "use client";

import React from "react";
import { useRouter } from "next/navigation";

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
    <header className="bg-transparent p-2 sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between bg-transparent px-4 py-2">
        <div className="flex items-center space-x-3">

        </div>

        <div>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold py-1.5 px-4 rounded shadow-md transition-all uppercase"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;