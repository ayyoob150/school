"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

export default function School() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState();
  const [subdomain, setSubdomain] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const subdomain = window.location.hostname.split(".");
    setSubdomain(subdomain);
  }, []);
  console.log(subdomain)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwt.decode(token);
    if (token && decoded.email) {
      setUser(decoded);
    }
  }, [pathname]);

  useEffect(() => {
    async function fetchData() {
      if (subdomain?.length > 1) {
        const response = await fetch(`/api/school/${subdomain[0]}`);
        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          console.error(result.error);
        }
      } else {
        const response = await fetch(`/api/school`);
        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          console.error(result.error);
        }
      }
    }
    fetchData();
  }, [subdomain]);
  const editButtonHanlder = (id, name) => {
    router.push(`/profile?editid=${id}&name=${name}`);
  };

  const deleteHandler = async (id) => {

    try {
      const response = await fetch("/api/school", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({id})
      });

      if (!response.ok) {
        const result = await response.text();
        console.log(result)
        return;
      }

      const data = await response.json();
      if(data?._id){
        router.push(subdomain[1])
      }
      console.log(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center flex-wrap gap-2 mt-2">
      {subdomain?.length > 1 ? (
        <div className="border border-slate-100 shadow rounded px-5 py-3">
          <div className="flex justify-end">
                {user?.role === "admin" && (
                  <span
                    onClick={()=>deleteHandler(data._id)}
                    className="flex items-center justify-center px-2 py-1 text-xs font-semibold text-red-600 shadow rounded border border-slate-100 cursor-pointer"
                  >
                    Delete
                  </span>
                )}
              </div>
          <div className="container mx-auto p-4">
            <div className="text-3xl font-bold">
              <span className="text-slate-500">Name -</span>{" "}
              {data?.name?.replace(/-/g, " ")}
            </div>
            <p className="mt-3">
              {" "}
              <span className="text-slate-500">Description -</span>{" "}
              {data?.description}
            </p>
            <p className="mt-3">
              {" "}
              <span className="text-slate-500">Contact -</span> {data?.contact}
            </p>
          </div>
        </div>
      ) : (
        data?.map((item, i) => (
          <div className="border border-slate-100 shadow rounded " key={i}>
            <div className="container mx-auto p-4 pb-8 px-8">
              <div className="flex justify-end">
                {user?.role === "admin" && (
                  <span
                    onClick={() => editButtonHanlder(item?._id, item?.name)}
                    className="flex items-center justify-center px-2 py-1 text-xs font-semibold text-slate-600 shadow rounded border border-slate-100 cursor-pointer"
                  >
                    Edit
                  </span>
                )}
              </div>
              <span className="text-2xl font-bold">
                <span className="text-slate-500">Name -</span>{" "}
                {item?.name?.replace(/-/g, " ")?.toUpperCase()}
              </span>{" "}
              <p>
                <span className="text-slate-500">Description -</span>{" "}
                {item?.description}
              </p>
              <div>
                <p>
                  <span className="text-slate-500">Contact -</span>{" "}
                  {item?.contact}
                </p>
              </div>
              {
                <a
                  href={`http://${item?.name?.toLowerCase()}.${subdomain.join()}:3000`}
                  className="underline text-blue-500 cursor-pointer"
                >
                  {subdomain &&
                    `http://${item?.name?.toLowerCase()}.${subdomain.join()}:3000`}
                </a>
              }
            </div>
          </div>
        ))
      )}
    </div>
  );
}
