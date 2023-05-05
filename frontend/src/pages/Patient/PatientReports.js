import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { Table, Tag, Modal, Spin, Select } from "antd";
import {
  getAllHospital,
  getHospital,
  newReport,
} from "../../services/hospital";
import { getAllDoctors, getDoctor } from "../../services/doctor";
import { getAllPatientReports } from "../../services/patient";

const PatientReports = () => {
  const [Reports, setReports] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [openPatientModal, setOpenPatientModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setTableIsLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospital, setHospital] = useState("");
  const [doctor, setDoctor] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getAllReportFunc();
    getAllHospitals();
    getAllDoctorsFunc();
    setTableIsLoading(false);
  }, []);

  const getAllHospitals = async () => {
    const data = await getAllHospital();
    setHospitals(data);
  };

  const getAllDoctorsFunc = async () => {
    const data = await getAllDoctors();
    setDoctors(data);
  };

  const getAllReportFunc = async () => {
    setTableIsLoading(true);
    const data = await getAllPatientReports();
    for (var i = 0; i < data.length; i++) {
      const hosname = (await getHospital(data[i].hospital_id)).name;
      const doctorName = (await getDoctor(data[i].doctor_id)).name;

      data[i].hospital_name = hosname;
      data[i].doctor_name = doctorName;
    }

    setReports(data);
  };

  const columns = [
    {
      title: "Report Id",
      dataIndex: "report_id",
      key: "report_id",
      render: (report_id) => <div>{report_id}</div>,
    },

    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Hospital",
      dataIndex: "hospital_name",
      key: "hospital_name",
      render: (hospital_name) => <div>{hospital_name}</div>,
    },

    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
    },

    {
      title: "Ref Doctor",
      dataIndex: "doctor_name",
      key: "doctor_name",
      render: (_, { doctor_name }) => (
        <Tag color="orange" key={doctor_name}>
          {doctor_name}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color="green" key={status}>
          {status}
        </Tag>
      ),
    },
  ];

  const submitReport = async () => {
    if (hospital !== "" && doctor !== "" && title !== "") {
      setIsLoading(true);
      const res = await newReport(hospital, doctor, title);
      if (res) {
        setIsLoading(false);
        setDoctor("");
        setTitle("");
        setHospital("");
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

  const searchReport = (text) => {
    let newArray = Reports.filter((o) =>
      Object.keys(o).some((k) =>
        o[k].toString().toLowerCase().includes(text.toLowerCase())
      )
    );

    setFilteredReport(newArray);
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
                  Create new report
                </h1>
              </div>

              <div className="mt-15 mb-15">
                <form>
                  <div className="grid gap-y-4">
                    <div>
                      <label
                        for="title"
                        className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                      >
                        Title
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="title"
                          name="title"
                          className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                          required
                          onChange={(e) => {
                            setTitle(e.target.value.trim());
                          }}
                          aria-describedby="title-error"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        for="hospital"
                        className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                      >
                        Select the hospital
                      </label>
                      <div className="relative">
                        <Select
                          placeholder=""
                          value={hospital}
                          onChange={(value) => {
                            setHospital(value);
                          }}
                          style={{
                            width: "100%",
                          }}
                          options={hospitals.map((item) => ({
                            value: item.id,
                            label: item.name,
                          }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="doctor"
                        className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                      >
                        Select the doctor
                      </label>
                      <div className="relative">
                        <Select
                          placeholder=""
                          value={doctor}
                          onChange={(value) => {
                            setDoctor(value);
                          }}
                          style={{
                            width: "100%",
                          }}
                          options={doctors.map((item) => ({
                            value: item.id,
                            label: item.name,
                          }))}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={submitReport}
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
            Add New Report
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
                searchReport(e.target.value.trim());
              } else {
                setFilteredReport([]);
              }
            }}
          />
        </div>
        <div className="pl-10 pr-10 pb-10 pt-5">
          <Table
            columns={columns}
            dataSource={filteredReport.length > 0 ? filteredReport : Reports}
            loading={isTableLoading}
          />
        </div>
      </div>
    </>
  );
};

export default PatientReports;
