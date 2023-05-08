import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { Table, Tag, Modal, Spin } from "antd";
import { getLab } from "../../services/lab";
import { getDoctor, updateTestResult } from "../../services/doctor";
import { getAllPatientTests } from "../../services/patient";

const PatientTests = () => {
  const [Tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setTableIsLoading] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);
  const [result, setResult] = useState("");
  const [testId, setTestId] = useState("");

  useEffect(() => {
    getAllTestsFunc();
    setTableIsLoading(false);
  }, []);

  const getAllTestsFunc = async () => {
    setTableIsLoading(true);
    const data = await getAllPatientTests();
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      const doctorName = (await getDoctor(data[i].ref_doctor)).name;
      const labName = (await getLab(data[i].lab_id)).name;

      data[i].doctor_name = doctorName;
      data[i].lab_name = labName;
    }

    setTests(data);
  };

  const columns = [
    {
      title: "ReportID",
      dataIndex: "report_id",
      key: "report_id",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Labratory",
      dataIndex: "lab_name",
      key: "lab_name",
    },

    {
      title: "Name",
      dataIndex: "test_name",
      key: "test_name",
    },

    {
      title: "RefDoctor",
      dataIndex: "doctor_name",
      key: "doctor_name",
    },

    {
      title: "Result",
      dataIndex: "test_result",
      key: "test_result",
      render: (_, { test_result }) =>
        test_result === "" ? (
          <span className="font-bold text-lg">Pending</span>
        ) : (
          <span className="font-bold text-lg text-black">{test_result}</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) =>
        status === 0 ? (
          <Tag color="orange-inverse" key={status}>
            Pending
          </Tag>
        ) : (
          <Tag color="green-inverse" key={status}>
            Done
          </Tag>
        ),
    },
    {
      title: "Actions",
      dataIndex: "test_id",
      key: "actions",
      render: (test_id, record) => (
        <div>
          <Tag
            color="red-inverse"
            className="cursor-pointer hover:animate-pulse p-1"
            onClick={() => {
              setTestId(test_id);
              setOpenResultModal(true);
            }}
          >
            Update Result
          </Tag>
        </div>
      ),
    },
  ];

  const searchTests = (text) => {
    let newArray = Tests.filter((o) =>
      Object.keys(o).some((k) =>
        o[k].toString().toLowerCase().includes(text.toLowerCase())
      )
    );

    setFilteredTests(newArray);
  };

  const submitResult = async () => {
    if (result !== "" && testId !== "") {
      setIsLoading(true);
      const res = await updateTestResult(testId, result);
      if (res) {
        setIsLoading(false);
        setTestId("");
        setResult("");
        setOpenResultModal(false);
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

  return (
    <>
      <Modal
        style={{
          top: 20,
        }}
        open={openResultModal}
        footer={null}
        closeIcon={<p></p>}
      >
        <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
          <div className="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                  Update result of test
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
                        Result
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="title"
                          name="title"
                          className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                          required
                          onChange={(e) => {
                            setResult(e.target.value.trim());
                          }}
                          aria-describedby="title-error"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={submitResult}
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
                      onClick={() => setOpenResultModal(false)}
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
        <div className="pt-2 relative mx-auto text-gray-600 mt-10">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Search"
            onChange={(e) => {
              if (e.target.value.trim() !== "") {
                searchTests(e.target.value.trim());
              } else {
                setFilteredTests([]);
              }
            }}
          />
        </div>
        <div className="pl-10 pr-10 pb-10 pt-5">
          <Table
            columns={columns}
            dataSource={filteredTests.length > 0 ? filteredTests : Tests}
            loading={isTableLoading}
          />
        </div>
      </div>
    </>
  );
};

export default PatientTests;
