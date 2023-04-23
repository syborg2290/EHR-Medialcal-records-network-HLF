import React from "react";
import { logout } from "../services/user";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div>
      <section className="text-gray-600 body-font bg-gray-50 h-screen flex justify-center items-center">
        <div className="container px-5 py-24 mx-auto">
          <h1 className="text-4xl py-10 opacity-40 font-bold">
            Admin Portal Of Healthcare Network
          </h1>
          <div className="flex flex-wrap -m-4 text-center">
            <div className="p-4 sm:w-1/2 lg:w-1/3 w-full hover:scale-105 duration-500">
              <div className=" flex items-center  justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-md">
                <div>
                  <h2 className="text-gray-900 text-2xl font-bold">Hospital</h2>

                  <p className="text-sm font-semibold text-gray-400">
                    Last Transaction
                  </p>
                  <button
                    onClick={() => {
                      navigate("/admin-hospital");
                    }}
                    className="text-sm mt-6 px-4 py-2 bg-yellow-400 text-white rounded-lg  tracking-wider hover:bg-yellow-300 outline-none"
                  >
                    Enter
                  </button>
                </div>
                <div className="bg-gradient-to-tr from-yellow-500 to-yellow-400 w-32 h-32  rounded-full shadow-2xl shadow-yellow-400 border-white  border-dashed border-2  flex justify-center items-center ">
                  <div>
                    <h1 className="text-white text-2xl">Hospital</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/3 w-full hover:scale-105 duration-500">
              <div className=" flex items-center  justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-md">
                <div>
                  <h2 className="text-gray-900 text-2xl font-bold">Doctors</h2>

                  <p className="text-sm font-semibold text-gray-400">
                    Last Transaction
                  </p>
                  <button className="text-sm mt-6 px-4 py-2 bg-orange-400  text-white rounded-lg  tracking-wider hover:bg-orange-500 outline-none">
                    Enter
                  </button>
                </div>
                <div className="bg-gradient-to-tr from-orange-500 to-orange-400 w-32 h-32  rounded-full shadow-2xl shadow-orange-400 border-white  border-dashed border-2  flex justify-center items-center ">
                  <div>
                    <h1 className="text-white text-2xl">Doctor</h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:w-1/2 lg:w-1/3 w-full hover:scale-105 duration-500">
              <div className=" flex items-center  justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-md">
                <div>
                  <h2 className="text-gray-900 text-2xl font-bold">
                    Pharmacies
                  </h2>

                  <p className="text-sm font-semibold text-gray-400">
                    Last Transaction
                  </p>
                  <button className="text-sm mt-6 px-4 py-2 bg-green-400  text-white rounded-lg  tracking-wider hover:bg-green-500 outline-none">
                    Enter
                  </button>
                </div>
                <div className="bg-gradient-to-tr from-green-500 to-green-500 w-32 h-32  rounded-full shadow-2xl shadow-green-400 border-white  border-dashed border-2  flex justify-center items-center ">
                  <div>
                    <h1 className="text-white text-2xl">Pharmacy</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/3 w-full hover:scale-105 duration-500">
              <div className=" flex items-center  justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-md">
                <div>
                  <h2 className="text-gray-900 text-2xl font-bold">
                    Laboratories
                  </h2>

                  <p className="text-sm font-semibold text-gray-400">
                    Last Transaction
                  </p>
                  <button className="text-sm mt-6 px-4 py-2 bg-cyan-400  text-white rounded-lg  tracking-wider hover:bg-cyan-500 outline-none">
                    Enter
                  </button>
                </div>
                <div className="bg-gradient-to-tr from-cyan-500 to-cyan-400 w-32 h-32  rounded-full shadow-2xl shadow-cyan-400 border-white  border-dashed border-2  flex justify-center items-center ">
                  <div>
                    <h1 className="text-white text-2xl">Laboratory</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            class="group rounded-2xl h-12 w-48 bg-red-500 font-bold text-sm text-white relative overflow-hidden"
            onClick={logout}
          >
            Logout
            <div class="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-2xl"></div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
