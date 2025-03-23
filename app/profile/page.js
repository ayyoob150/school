"use client";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState();
  const [error, setError] = useState("");
  const [schoolData, setSchoolData] = useState({
    name: "",
    description: "",
    contact: "",
  });

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams()
  const editId = searchParams.get('editid')
  const name = searchParams.get('name')


  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwt.decode(token);
    if (token && decoded.email) {
      setIsLogin(true);
      setUser(decoded);
    } else {
      setIsLogin(false);
      router.push("/login");
    }
  }, [pathname]);

  useEffect(() => {
    async function fetchData() {
        const response = await fetch(`/api/school/${name}`);
        const result = await response.json();

        if (response.ok) {
          setSchoolData(result);
        } else {
          console.error(result.error);
        }
      }
    fetchData();
  }, [name]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setSchoolData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!schoolData.name || !schoolData.description || !schoolData.contact) {
      setError("Please fill all the field");
      return;
    }

    try {
      const response = await fetch("/api/school", {
        method: editId?"PUT":"POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({...schoolData,id:editId}),
      });

      if (!response.ok) {
        const result = await response.text();
        setError(result);
        return;
      }

      const data = await response.json();
      if(data?._id){
        router.push('/')
      }
      console.log(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="text-center mt-8">
      {user?.role === "admin" ? (
        <div className="font-bold text-slate-600 text-lg mb-4">
          Welcome Admin !
        </div>
      ) : (
        <div>Welcome</div>
      )}
      <div>
        <span className="font-bold text-slate-600">User -</span> {user?.email}
      </div>
      {user?.role === "admin" && (
        <div className="flex justify-center mt-6">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-slate-100">
            <div className="text-lg font-bold text-center mb-6 text-slate-600">
              {editId?"Edit School" :"Add School"}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="mb-4">
                <label className="text-start block text-sm font-medium text-gray-700">
                  School Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={schoolData?.name}
                  onChange={(e) => onChangeHandler(e)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="text-start block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={schoolData?.description}
                  onChange={(e) => onChangeHandler(e)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="text-start block text-sm font-medium text-gray-700">
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  value={schoolData?.contact}
                  onChange={(e) => onChangeHandler(e)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
