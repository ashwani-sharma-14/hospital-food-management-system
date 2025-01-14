"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const NavBar = () => {
  const router = useRouter();

  const handleSignOut = () => {
    document.cookie =
      "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    window.location.href = "/sign-in";
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
          🏥 Hospital Food Management
        </div>

        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
