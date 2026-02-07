import React, { useState, useEffect } from "react";
import { X, ImageIcon, Monitor, Save, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/axios";

const AddMenuBanner = ({
  closeModal,
  mode = "add",
  selectedSection,
  selectedContent,
  refetch,
}) => {
  const id = selectedContent?._id;

  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [loading, setLoading] = useState(false);
  const [existingMediaUrl, setExistingMediaUrl] = useState(null);

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    mediaType: "image",
    media: null,
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const MAX_SIZE = 9 * 1024 * 1024; // 9MB

  const fetchCategories = async () => {
    if (hasFetched) return; // 🚫 prevent refetch

    try {
      setLoadingCategories(true);
      const res = await api.get("/api/categories/get-categories");
      setCategories(res.data.data || []);
      setHasFetched(true);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // const handleChangeDropdown = (e) => {
  //   const value = e.target.value;
  //   setSelectedValue(value);
  // };

  useEffect(() => {
    if (mode === "edit" && selectedContent) {
      setIsEditMode(true);
      // Populate form with selected job data
      setFormData({
        heading: selectedContent.heading || "",
        description: selectedContent.description || "",
        mediaType: selectedContent.media?.mediaType || "image",
        media: null, // user may re-upload
      });
      fetchCategories();
      setSelectedValue(selectedContent.categoryId);
      setExistingMediaUrl(selectedContent.media?.url || null);
    } else {
      setIsEditMode(false);
      // Reset form for add mode
      resetForm();
    }
  }, [mode, selectedContent]);

  const resetForm = () => {
    setFormData({
      heading: "",
      description: "",
      mediaType: "image",
      media: null,
    });
    setExistingMediaUrl(null);
  };

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
    // 🔒 1. FILE SIZE VALIDATION
    if (formData.media && formData.media.size > MAX_SIZE) {
      toast.error(
        `${formData.mediaType === "image" ? "Image" : "Video"} is ${(
          formData.media.size /
          (1024 * 1024)
        ).toFixed(2)}MB. Max allowed is 9MB ❌`,
      );
      return;
    }

    setLoading(true);

    const toastId = toast.loading(
      isEditMode ? "Updating Content..." : "Saving Content...",
    );

    try {
      if (!selectedValue) {
        throw new Error("Please select a category before submitting");
      }
      /* ========= CREATE FORMDATA ========= */
      const data = new FormData();
      data.append("heading", formData.heading);
      data.append("description", formData.description);
      data.append("mediaType", formData.mediaType);
      data.append("categoryId", selectedValue);

      // append media ONLY if selected
      if (formData.media) {
        data.append("media", formData.media);
      }

      /* ========= API CALL ========= */
      if (isEditMode) {
        await api.put(
          `/api/contents/update-content/${id}`,
          data,
          // `https://ba-dastoor-backend.onrender.com/api/generalContent/update-content?page=${selectedSection}`,
        );
        toast.update(toastId, {
          render: "Content updated successfully ✅",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        await api.post(
          `/api/contents/create-content?page=${selectedSection}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        toast.update(toastId, {
          render: "Content created successfully 🎉",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }

      refetch();
      closeModal();
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      {" "}
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {/* Content */}
            {isEditMode ? "Edit Content" : "Add New Content"}
          </h2>
          <div className="flex items-center gap-3">
            {/* Select Dropdown */}
            <select
              value={selectedValue}
              onFocus={fetchCategories} // 👈 fetch ONLY when clicked
              // onChange={handleChangeDropdown}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                {loadingCategories ? "Loading..." : "Select Category"}
              </option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>

            {/* Close Button */}
            <button
              type="button"
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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

          {/* SECONDARY DESCRIPTION */}

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
            {isEditMode && existingMediaUrl && !formData.media && (
              <p className="mt-2 text-xs text-gray-600 break-all">
                <span className="font-medium text-gray-800">Current file:</span>{" "}
                <a
                  href={existingMediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {existingMediaUrl}
                </a>
              </p>
            )}
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

export default AddMenuBanner;
