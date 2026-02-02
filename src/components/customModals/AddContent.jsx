import React, { useState, useEffect } from "react";
import { X, ImageIcon, Monitor, Save } from "lucide-react";
// import axios from "axios";
import { toast } from "react-toastify";
// import { ProgressSpinner } from "primereact/progressspinner";
import api from "../../api/axios";

const AddContent = ({
  isModalOpen,
  closeModal,
  mode = "add",
  selectedContent,
  selectedSection,
  refreshList,
}) => {
  console.log(selectedSection);
  console.log(selectedContent);
  const [loading, setLoading] = useState(false);
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    // secondaryHeading: "",
    // secondaryDescription: "",
    mediaType: "image",
    // logo: null,
    media: null,
  });

  /* =========================
   FETCH EXISTING ABOUT US
  ========================= */

  useEffect(() => {
    if (!isModalOpen) return;

    if (
      mode === "edit" &&
      selectedContent &&
      Object.keys(selectedContent).length
    ) {
      setFormData({
        heading: selectedContent.heading ?? "",
        description: selectedContent.description ?? "",
        mediaType: selectedContent.mediaType ?? "image",
        media: null,
      });
    }

    if (mode === "add") {
      setFormData({
        heading: "",
        description: "",
        mediaType: "image",
        media: null,
      });
    }
  }, [mode, selectedContent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading(
      isEditMode ? "Updating Content..." : "Saving Content...",
    );

    try {
      setLoading(true);

      /* ========= CREATE FORMDATA ========= */
      const data = new FormData();
      data.append("heading", formData.heading);
      data.append("description", formData.description);
      //   data.append("secondaryHeading", formData.secondaryHeading);
      //   data.append("secondaryDescription", formData.secondaryDescription);

      // append media ONLY if selected
      if (formData.media) {
        data.append("mediaType", formData.mediaType);
        data.append("media", formData.media);
      }

      // append logo ONLY if selected
      //   if (formData.logo) {
      //     data.append("logo", formData.logo);
      //   }

      /* ========= API CALL ========= */
      if (isEditMode && selectedContent) {
        await api.put(
          `/api/general-content/edit-general-content?page=${selectedSection}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        toast.update(toastId, {
          render: "Content updated successfully ✅",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        await api.post(
          `/api/general-content/create-general-content?page=${selectedSection}`,
          data,
        );

        toast.update(toastId, {
          render: "Content created successfully 🎉",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }

      refreshList?.();
      closeModal();
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: error?.response?.data?.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Edit Content" : "Add New Content  "}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className=" text-gray-500 hover:text-gray-700 text-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* HEADING */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              placeholder="Enter content heading"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              required
            />
          </div>
          {/* SECONDARY HEADING */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secondary Heading
            </label>
            <input
              type="text"
              name="secondaryHeading"
              value={formData.secondaryHeading}
              onChange={handleChange}
              placeholder="Enter secondary heading"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div> */}

          {/* SECONDARY DESCRIPTION */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secondary Description
            </label>
            <textarea
              name="secondaryDescription"
              rows={4}
              value={formData.secondaryDescription}
              onChange={handleChange}
              placeholder="Enter secondary description"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              required
            />
          </div> */}

          {/* MEDIA TYPE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  value="image"
                  checked={formData.mediaType === "image"}
                  onChange={handleChange}
                />
                <ImageIcon className="w-4 h-4" />
                Image
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  value="video"
                  checked={formData.mediaType === "video"}
                  onChange={handleChange}
                />
                <Monitor className="w-4 h-4" />
                Video
              </label>
            </div>
          </div>

          {/* LOGO UPLOAD */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              name="logo"
              onChange={handleFileChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4
                               file:rounded-lg file:border-0
                               file:bg-blue-50 file:text-blue-700
                               hover:file:bg-blue-100"
            />
          </div> */}

          {/* MEDIA UPLOAD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.mediaType === "image" ? "Image" : "Video"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="media"
              accept={formData.mediaType === "image" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4
                               file:rounded-lg file:border-0
                               file:bg-green-50 file:text-green-700
                               hover:file:bg-green-100"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  {/* <ProgressSpinner /> */}
                  {mode === "edit" ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {mode === "edit" ? "Update Content" : "Save Content"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContent;
