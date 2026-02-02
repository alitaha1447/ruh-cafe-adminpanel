import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, X, User } from "lucide-react";
import axios from "axios";
import api from "../api/axios";
import AddJob from "../components/customModals/AddJob";
import { toast } from "react-toastify";

const CareerManagement = () => {
  const [jobList, setJobList] = useState([]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'

  const fetchJobList = async () => {
    try {
      const res = await api.get("/api/job/get-all-jobs");
      setJobList(res?.data?.data);
    } catch (error) {
      console.error("Error fetching job list:", error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobList();
  }, []);

  const handleAddClick = () => {
    setSelectedJob(null);
    setShowJobModal(true);
    setModalMode("add");
  };

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
    setModalMode("edit");
  };

  const handleDeleteJob = async (id) => {
    toast.warning(
      ({ closeToast }) => (
        <div>
          <p className="font-medium mb-3">
            Are you sure you want to delete this content?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={closeToast}
              className="px-3 py-1 border rounded-md text-sm"
            >
              Cancel
            </button>

            <button
              onClick={() => confirmDeleteDish(id, closeToast)}
              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
      },
    );
  };

  const confirmDeleteDish = async (id, closeToast) => {
    closeToast(); // close confirmation toast

    const toastId = toast.loading("Deleting Job...");

    try {
      const response = await api.delete(`/api/job/delete-job/${id}`);
      toast.update(toastId, {
        render: "Content deleted successfully 🗑️",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      await fetchJobList();
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: error?.response?.data?.message || "Failed to delete content ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
    }
  };

  return (
    <div>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Career Management
            </h1>
          </div>
          <button
            onClick={handleAddClick}
            className="inline-flex w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Job
          </button>
        </div>
      </div>
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Experience
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status (Active / Inactive)
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobList.length > 0 ? (
                jobList?.map((job) => (
                  <tr
                    key={job?._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {job?.jobTitle}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {job?.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {job?.location}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {job?.experience} years
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {job?.status === true ? "Active" : "InActive"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(job)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          // disabled={isLoading}
                          onClick={() => handleDeleteJob(job?._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    {"No jobs available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showJobModal && (
        <AddJob
          //   isModalOpen={showJobModal}
          closeModal={() => setShowJobModal(false)}
          mode={modalMode} // 'add' or 'edit'
          selectedJob={selectedJob}
          refreshList={fetchJobList} // Pass the refresh function
        />
      )}
    </div>
  );
};

export default CareerManagement;
