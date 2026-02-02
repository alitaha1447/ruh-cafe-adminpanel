import React, { useEffect, useState } from "react";
import { X, Upload, User, Plus, ImagePlus, Save } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/axios";

const AddSEO = ({
  mode = "add",
  closeModal,
  selectedSection,
  seoData = null,
  refreshData,
}) => {
  console.log(seoData?._id);
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
  });

  useEffect(() => {
    if (isEditMode && seoData) {
      setFormData({
        title: seoData.title || "",
        description: seoData.description || "",
        slug: seoData.slug || selectedSection?.id || "",
      });
    } else if (!isEditMode && selectedSection?.id) {
      setFormData((prev) => ({
        ...prev,
        slug: selectedSection.id,
      }));
    }
  }, [isEditMode, seoData, selectedSection]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { title, description, slug } = formData;

    if (!title || !description || !slug) {
      toast.error("Missing required SEO data");
      return;
    }

    try {
      if (isEditMode) {
        await api.put(`/api/seo/update-seo/${seoData?._id}`, {
          title,
          description,
          slug,
        });

        toast.success("SEO updated successfully");
      } else {
        await api.post("/api/seo/create-seo", {
          title,
          description,
          slug,
        });

        toast.success("SEO added successfully");
      }

      refreshData?.();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Edit SEO" : "Add SEO"}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter SEO title"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter SEO description"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              readOnly
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
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

export default AddSEO;
