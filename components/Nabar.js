"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const pathname = usePathname();
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwt.decode(token);
    if (token && decoded.email) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [pathname]);

  return (
    <nav className="bg-slate-50 text-white px-2 py-2 shadow border-b sticky top-0 z-50">
      <div className="px-2 md:px-10 mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-slate-500">
          School<span className=" text-slate-400  rounded"> Demo</span>
        </Link>
        <ul className="flex space-x-8 text-slate-500">
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
          {isLogin && (
            <li>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
            </li>
          )}
          <li>
            {isLogin ? (
              <Link
                href="./login"
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsLogin(false);
                }}
                className="hover:underline"
              >
                Logout
              </Link>
            ) : (
              <Link href="./login" className="hover:underline">
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
