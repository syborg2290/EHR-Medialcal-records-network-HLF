import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { Table, Tag, Modal, Spin } from "antd";
import { getAllPatients, newPatient } from "../../services/patient";

const PatientTests = () => {
  const [Patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [openPatientModal, setOpenPatientModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setTableIsLoading] = useState(false);
  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const [bloodtype, setBloodType] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    getAllPatientsFunc();
    setTableIsLoading(false);
  }, []);

  const getAllPatientsFunc = async () => {
    // setTableIsLoading(true);
    // const data = await getAllPatients();
    // setPatients(data);

    setPatients([
      {
        ReportID: "fdi486-53495khfd-43653k",
        Labratory: "Asiri Hospital",
        Name:'Liver Test',
        Supervisor:'Mr.Tharaka',
        TestType:'',
        RefDoctor: "Dr.Gamage",
        Result: "5.6",
        Status: "Positive",
      },
      {
        ReportID: "fdi486-53495khfd-43653k",
        Labratory: "Ruhunu Hospital",
        Name:'Brain Tumor Test',
        Supervisor:'',
        TestType:'',
        RefDoctor: "Dr.Gamage",
        Result: "3.5",
        Status: "Medium",
      },
    ]);
  };

  const columns = [
    {
      title: "ReportID",
      dataIndex: "ReportID",
      key: "ReportID",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Labratory",
      dataIndex: "Labratory",
      key: "Labratory",
    },

    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },

    {
      title: "Supervisor",
      dataIndex: "Supervisor",
      key: "Supervisor",
    },

    {
      title: "Result",
      dataIndex: "Result",
      key: "Result",
    },

    {
      title: "RefDoctor",
      dataIndex: "RefDoctor",
      key: "RefDoctor",
    },

    {
      title: "Test Type",
      dataIndex: "TestType",
      key: "TestType",
    },

    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (_, { Status }) => (
        <Tag color="green" key={Status}>
          {Status}
        </Tag>
      ),
    },
  ];

  const submitPatient = async () => {
    if (fname !== "" && lname !== "" && bloodtype !== "" && age !== "") {
      setIsLoading(true);
      const res = await newPatient(fname, lname, bloodtype, age, "");
      if (res) {
        setIsLoading(false);
        setfName("");
        setlName("");
        setBloodType("");
        setAge("");
        setOpenPatientModal(false);
        window.location.reload();
      } else {
        setIsLoading(false);
      }
    } else {
      swal({
        text: "Please provide required data!",
        icon: "error",
        type: "error",
        dangerMode: true,
        title: "Validation Error",
      });
    }
  };

  const searchPatients = (text) => {
    let newArray = Patients.filter((o) =>
      Object.keys(o).some((k) =>
        o[k].toString().toLowerCase().includes(text.toLowerCase())
      )
    );

    setFilteredPatients(newArray);
  };

  return (
    <>
      <Modal
        style={{
          top: 20,
        }}
        open={openPatientModal}
        footer={null}
        closeIcon={<p></p>}
      >
        <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
          <div className="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                  Add New Test
                </h1>
              </div>

              <div className="mt-15 mb-15">
                <form>
                  <div className="grid gap-y-4">
                    <div>
                      <label
                        for="name"
                        className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                      >
                        ReportID
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                          required
                          onChange={(e) => {
                            setfName(e.target.value.trim());
                          }}
                          aria-describedby="name-error"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="lname"
                        className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                      >
                        Labratory Id
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="lname"
                          name="lname"
                          className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                          required
                          onChange={(e) => {
                            setlName(e.target.value.trim());
                          }}
                          aria-describedby="lname-error"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="bloodtype"
                        className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                      >
                        Test Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="bloodtype"
                          name="bloodtype"
                          className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                          required
                          onChange={(e) => {
                            setBloodType(e.target.value.trim());
                          }}
                          aria-describedby="bloodtype-error"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="age"
                        className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                      >
                        Supervisor
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="age"
                          name="age"
                          className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                          required
                          onChange={(e) => {
                            setAge(e.target.value.trim());
                          }}
                          aria-describedby="age-error"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        for="age"
                        className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                      >
                        RefDoctor
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="age"
                          name="age"
                          className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                          required
                          onChange={(e) => {
                            setAge(e.target.value.trim());
                          }}
                          aria-describedby="age-error"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        for="age"
                        className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                      >
                        Test Type
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="age"
                          name="age"
                          className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                          required
                          onChange={(e) => {
                            setAge(e.target.value.trim());
                          }}
                          aria-describedby="age-error"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-center w-full">
                      <label
                        for="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            aria-hidden="true"
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Upload Your Test Medical Image
                            </span>{" "}
                            or drag and drop
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={submitPatient}
                      className={
                        !isLoading
                          ? "py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                          : "py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-white text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                      }
                    >
                      {isLoading ? <Spin size="large" /> : "Submit"}
                      {/* submit */}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpenPatientModal(false)}
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </Modal>

      {/*  */}
      <div>
        <div className="pt-20 pb-1 place-items-center place-content-center">
          <button
            onClick={() => {
              setOpenPatientModal(true);
            }}
            className="group rounded-2xl h-12 w-48 bg-green-600 font-bold text-sm text-white relative overflow-hidden"
          >
            Add New Test
            <div className="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-2xl"></div>
          </button>
        </div>
        <div className="pt-2 relative mx-auto text-gray-600 mt-10">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Search"
            onChange={(e) => {
              if (e.target.value.trim() !== "") {
                searchPatients(e.target.value.trim());
              } else {
                setFilteredPatients([]);
              }
            }}
          />
        </div>
        <div className="pl-10 pr-10 pb-10 pt-5">
          <Table
            columns={columns}
            dataSource={
              filteredPatients.length > 0 ? filteredPatients : Patients
            }
            loading={isTableLoading}
          />
        </div>
      </div>
    </>
  );
};

export default PatientTests;
