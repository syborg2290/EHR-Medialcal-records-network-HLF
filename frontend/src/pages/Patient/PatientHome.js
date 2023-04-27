import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bubble } from "react-chartjs-2";
const { faker } = require("@faker-js/faker");

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const data = {
  datasets: [
    {
      label: "Red dataset",
      data: Array.from({ length: 50 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
        r: faker.datatype.number({ min: 5, max: 20 }),
      })),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Blue dataset",
      data: Array.from({ length: 50 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
        r: faker.datatype.number({ min: 5, max: 20 }),
      })),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const PatientHome = () => {
  const navigate = useNavigate();
  return (
    <section className="text-gray-600 body-font bg-gray-50 h-screen flex justify-center items-center">
      <div className="container px-5 py-24 mx-auto">
        <h1 className="text-4xl py-10 opacity-40 font-bold">
          Patient Portal Of Healthcare Network
        </h1>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <div className="flex flex-wrap -m-4 text-center">
              <div className="p-4 lg:w-2/3 w-full hover:scale-105 duration-500">
                <div className=" flex items-center  justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-md">
                  <div>
                    <h2 className="text-gray-900 text-3xl font-bold">
                      Patient Treatments
                    </h2>

                    <button
                      onClick={() => {
                        navigate("/patient-treatments");
                      }}
                      className="text-sm mt-6 px-4 py-2 bg-yellow-400 text-white rounded-lg  tracking-wider hover:bg-yellow-300 outline-none"
                    >
                      Enter
                    </button>
                  </div>
                  <div className="bg-gradient-to-tr from-yellow-500 to-yellow-400 w-32 h-32  rounded-full shadow-2xl shadow-yellow-400 border-white  border-dashed border-2  flex justify-center items-center ">
                    <div>
                      <h1 className="text-white text-5xl">TR</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap -m-4 text-center">
              <div className="p-4 lg:w-2/3 w-full hover:scale-105 duration-500">
                <div className=" flex items-center  justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-md">
                  <div>
                    <h2 className="text-gray-900 text-3xl font-bold">
                      Patient Tests
                    </h2>

                    <button
                      onClick={() => {
                        navigate("/patient-tests");
                      }}
                      className="text-sm mt-6 px-4 py-2 bg-blue-400 text-white rounded-lg  tracking-wider hover:bg-blue-300 outline-none"
                    >
                      Enter
                    </button>
                  </div>
                  <div className="bg-gradient-to-tr from-blue-500 to-blue-400 w-32 h-32  rounded-full shadow-2xl shadow-blue-400 border-white  border-dashed border-2  flex justify-center items-center ">
                    <div>
                      <h1 className="text-white text-5xl">TE</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap -m-4 text-center">
              <div className="p-4  lg:w-2/3 w-full hover:scale-105 duration-500">
                <div className=" flex items-center  justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-md">
                  <div>
                    <h2 className="text-gray-900 text-3xl font-bold">
                      Patient Drugs
                    </h2>

                    <button
                      onClick={() => {
                        navigate("/patient-drugs");
                      }}
                      className="text-sm mt-6 px-4 py-2 bg-red-400 text-white rounded-lg  tracking-wider hover:bg-red-300 outline-none"
                    >
                      Enter
                    </button>
                  </div>
                  <div className="bg-gradient-to-tr from-red-500 to-red-400 w-32 h-32  rounded-full shadow-2xl shadow-red-400 border-white  border-dashed border-2  flex justify-center items-center ">
                    <div>
                      <h1 className="text-white text-5xl">DR</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap -m-4 text-center">
              <div className="p-4  lg:w-2/3 w-full hover:scale-105 duration-500">
                <div className=" flex items-center  justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-md">
                  <div>
                    <h2 className="text-gray-900 text-3xl font-bold">
                      Patient Reports
                    </h2>

                    <button
                      onClick={() => {
                        navigate("/patient-reports");
                      }}
                      className="text-sm mt-6 px-4 py-2 bg-blue-400 text-white rounded-lg  tracking-wider hover:bg-blue-300 outline-none"
                    >
                      Enter
                    </button>
                  </div>
                  <div className="bg-gradient-to-tr from-blue-500 to-blue-400 w-32 h-32  rounded-full shadow-2xl shadow-blue-400 border-white  border-dashed border-2  flex justify-center items-center ">
                    <div>
                      <h1 className="text-white text-5xl">RE</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-10">
              <div className="mb-10">
                <div>
                  <span className="text-lg font-bold">Name : </span>
                  <span className="text-xl">Kasun Gamage</span>
                </div>
                <div>
                  <span className="text-lg font-bold">Age : </span>
                  <span className="text-xl">30</span>
                </div>
                <div>
                  <span className="text-lg font-bold">Blood Type : </span>
                  <span className="text-xl">0+</span>
                </div>
              </div>

              <div className="p-1">
                <h1 className="opacity-50 text-bold text-lg">
                  Patient Health Condition
                </h1>
                <Bubble options={options} data={data} />;
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientHome;
