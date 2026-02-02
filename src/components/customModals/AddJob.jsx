import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import api from "../../api/axios";
import { toast } from "react-toastify";

const AddJob = ({ mode = "add", closeModal, selectedJob, refreshList }) => {
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [loading, setLoading] = useState(false);

  const initialFormData = {
    jobTitle: "",
    location: "",
    experience: "",
    status: true,
    description: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (mode === "edit" && selectedJob) {
      setIsEditMode(true);
      // Populate form with selected job data
      setFormData({
        jobTitle: selectedJob.jobTitle || "",
        location: selectedJob.location || "",
        experience: selectedJob.experience || "",
        status: selectedJob.status !== undefined ? selectedJob.status : true,
        description: selectedJob.description || "",
      });
    } else {
      setIsEditMode(false);
      // Reset form for add mode
      resetForm();
    }
  }, [mode, selectedJob]);

  // Reset form function
  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditMode(false);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      jobTitle: formData?.jobTitle,
      message: formData?.description,
      location: formData?.location,
      experience: formData?.experience,
      status: formData?.status,
    };

    const toastId = toast.loading(
      isEditMode ? "Updating Job..." : "Saving Job...",
    );

    try {
      if (isEditMode) {
        const response = await api.put(
          `/api/job/edit-job/${selectedJob._id}`,
          payload,
        );
        toast.update(toastId, {
          render: "Job updated successfully ✅",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        const response = await api.post("/api/job/create-job", payload);
        toast.update(toastId, {
          render: "Job created successfully ✅",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
      refreshList();
      resetForm();
      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Edit Job" : "Add New Job  "}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className=" text-gray-500 hover:text-gray-700 text-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="jobTitle"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="e.g., Chef"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Bhopal"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience *
              </label>
              <input
                type="text"
                name="experience"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="e.g., 2–4 Years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>

              <div className="flex items-center gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === true}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, status: true }))
                    }
                    // onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === false}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, status: false }))
                    }
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              name="description"
              required
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe responsibilities, requirements, and skills..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            {/* <button
                            type="submit"
                            className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                            onClick={handleSubmitJob}
                        >
                            {isEditMode ? 'Update Job' : 'Add Job'}
                        </button> */}
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmitJob}
              className={`
        px-6 py-2.5 font-medium rounded-lg transition-all duration-200
        ${
          loading
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
        }
    `}
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                  ? "Update Job"
                  : "Add Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
