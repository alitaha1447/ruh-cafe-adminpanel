import React, { useState, useEffect } from "react";
import { X, ImageIcon, Monitor, Save } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../../api/axios";

const DISH_FEATURES = [
  { key: "spicy", label: "🌶️ Spicy" },
  { key: "chefSpecial", label: "👨‍🍳 Chef Special" },
  { key: "glutenFree", label: "🌾 Gluten Free" },
  { key: "bestSeller", label: "🔥 Best Seller" },
  { key: "kidsFriendly", label: "🧒 Kids Friendly" },
  { key: "healthy", label: "🥗 Healthy" },
];

const AddDish = ({
  mode = "add",
  closeModal,
  selectedCategory,
  selectedDish,
  refetch,
}) => {
  const categoryId = selectedCategory && selectedCategory._id;
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [loading, setLoading] = useState(false);
  const [existingMediaUrl, setExistingMediaUrl] = useState(null);

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    dishType: "veg",
    mediaType: "image",
    media: null,
    features: {
      spicy: false,
      chefSpecial: false,
      glutenFree: false,
      bestSeller: false,
      kidsFriendly: false,
      healthy: false,
    },
  });

  useEffect(() => {
    if (mode === "edit" && selectedDish) {
      setIsEditMode(true);
      // Populate form with selected job data
      setFormData({
        heading: selectedDish.dishName || "",
        description: selectedDish.dishDescription || "",
        dishType: selectedDish.dishType || "veg", // 👈 NEW
        mediaType: selectedDish.dishMedia?.mediaType || "image",
        media: null, // user may re-upload
        features: selectedDish.features || {
          spicy: false,
          chefSpecial: false,
          glutenFree: false,
          bestSeller: false,
          kidsFriendly: false,
          healthy: false,
        },
      });

      setExistingMediaUrl(selectedDish.dishMedia?.url || null);
    } else {
      setIsEditMode(false);
      // Reset form for add mode
      resetForm();
    }
  }, [mode, selectedDish]);

  const resetForm = () => {
    setFormData({
      heading: "",
      description: "",
      dishType: "veg",
      mediaType: "image",
      media: null,
      features: {
        spicy: false,
        chefSpecial: false,
        glutenFree: false,
        bestSeller: false,
        kidsFriendly: false,
        healthy: false,
      },
    });
    setExistingMediaUrl(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFeatureChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: !prev.features[key],
      },
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    const id = selectedDish?._id;
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading(
      isEditMode ? "Updating Dish..." : "Saving Dish...",
    );

    try {
      /* ========= CREATE FORMDATA ========= */
      const data = new FormData();
      data.append("heading", formData.heading);
      data.append("description", formData.description);
      data.append("dishType", formData.dishType);
      data.append("mediaType", formData.mediaType);
      data.append("features", JSON.stringify(formData.features));

      // append media ONLY if selected
      if (formData.media) {
        data.append("media", formData.media);
      }

      /* ========= API CALL ========= */
      if (isEditMode) {
        await api.put(`/api/dishes/update-dish/${id}`, data);
        toast.update(toastId, {
          render: "Dish updated successfully ✅",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        await api.post(`/api/dishes/create-dish/${categoryId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.update(toastId, {
          render: "Dish created successfully 🎉",
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
        render: error?.response?.data?.message || "Something went wrong",
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
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {/* Content */}
            {isEditMode ? "Edit Dish" : "Add New Dish  "}
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

          {/* VEG OR NON-VEG */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dish Type
            </label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dishType"
                  value="veg"
                  checked={formData.dishType === "veg"}
                  onChange={handleChange}
                />
                <span className="text-green-600 font-semibold">🥬 Veg</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dishType"
                  value="non-veg"
                  checked={formData.dishType === "non-veg"}
                  onChange={handleChange}
                />
                <span className="text-red-600 font-semibold">🍗 Non-Veg</span>
              </label>
            </div>
          </div>

          {/* DISH FEATURES */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dish Features
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DISH_FEATURES.map((feature) => (
                <label
                  key={feature.key}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition
          ${
            formData.features?.[feature.key]
              ? "bg-blue-50 border-blue-500 text-blue-700"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.features?.[feature.key]}
                    onChange={() => handleFeatureChange(feature.key)}
                    className="hidden"
                  />
                  <span className="text-sm font-medium">{feature.label}</span>
                </label>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-1">
              You can select none, some, or all features
            </p>
          </div>
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

export default AddDish;
