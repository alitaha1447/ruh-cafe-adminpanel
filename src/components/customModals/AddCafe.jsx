import React, { useState, useEffect } from "react";
import { X, Upload, User, Plus, ImagePlus } from "lucide-react";
import axios from "axios";
import api from "../../api/axios";
import { toast } from "react-toastify";

const AddCafe = ({
  mode = "add",
  closeModal,
  selectedData = null,
  refreshData,
}) => {
  console.log(selectedData);
  const [isEditMode, setIsEditMode] = useState(mode === "edit");

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
  });
  const [images, setImages] = useState({
    img1: null,
    img2: null,
    img3: null,
    img4: null,
  });

  const [editedSlot, setEditedSlot] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const MAX_SIZE = 9 * 1024 * 1024; // 9MB

  useEffect(() => {
    if (mode === "edit" && selectedData) {
      setIsEditMode(true);
      // 1️⃣ Fill text fields
      setFormData({
        heading: selectedData.heading || "",
        description: selectedData.description || "",
      });
      // 2️⃣ Map existing images by slot
      const mappedImages = {};
      selectedData.images?.forEach((img) => {
        mappedImages[img.slot] = img; // { img1: {url, publicId...} }
      });

      setExistingImages(mappedImages);
      // 3️⃣ Reset file inputs (important)
      //   setImages({
      //     img1: null,
      //     img2: null,
      //     img3: null,
      //     img4: null,
      //   });
    } else {
      setIsEditMode(false);
      // Reset form for add mode
      resetForm();
      setExistingImages({});
    }
  }, [mode, selectedData]);

  /* ==== HANDLERS IMAGES ==== */
  const handleImageChange = (e, slot) => {
    // console.log(slot)
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => ({ ...prev, [slot]: file }));
      setEditedSlot(slot); // ✅ THIS IS IMPORTANT
    }
  };

  /* ==== HANDLERS ==== */
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const resetForm = () => {
    setFormData({ heading: "", description: "" });
  };

  /* ========== SUBMIT ============ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadedImages = Object.values(images).filter(Boolean);

    if (uploadedImages.length < 4) {
      toast.error(
        "Please upload all 4 images. Images cannot be less than 4 ❌",
      );
      return;
    }
    // ✅ VALIDATION FOR ALL 4 IMAGES
    for (const [slot, file] of Object.entries(images)) {
      if (file && file.size > MAX_SIZE) {
        toast.error(
          `Image ${slot.toUpperCase()} is ${(file.size / (1024 * 1024)).toFixed(
            2,
          )}MB. Max allowed is 9MB ❌`,
        );
        return;
      }
    }
    setLoading(true);

    const data = new FormData();
    data.append("heading", formData.heading);
    data.append("description", formData.description);

    if (isEditMode && editedSlot) {
      data.append("slot", editedSlot);
    }
    Object.entries(images).forEach(([slot, file]) => {
      if (file) {
        const mediaType = file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
            ? "video"
            : null;

        if (!mediaType) return;

        data.append(slot, file);
        data.append(`${slot}MediaType`, mediaType);
      }
    });

    console.log("---- FormData ----");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    const toastId = toast.loading(
      isEditMode ? "Updating About Cafe..." : "Adding About Cafe...",
    );

    try {
      if (isEditMode) {
        console.log(isEditMode);
        await api.put("/api/about-cafe/edit-about-cafe", data);
        toast.update(toastId, {
          render: "About Cafe updated successfully ✅",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        await api.post("/api/about-cafe/create-about-cafe", data);
        toast.update(toastId, {
          render: "About Cafe added successfully ✅",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        alert("About Cafe added successfully");
      }

      refreshData?.();
      closeModal();
      // resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Edit About Cafe" : "Add About Cafe"}
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
              About Cafe *
            </label>
            <input
              type="text"
              name="heading"
              required
              value={formData.heading}
              onChange={handleInputChange}
              placeholder="About Cafe"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description about cafe..."
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Sibling Images (Max 4)</p>

            <div className="grid grid-cols-5 gap-3">
              {["img1", "img2", "img3", "img4"].map((key, index) => (
                <label
                  key={key}
                  className="flex flex-col justify-center items-center border-2 border-dashed rounded-xl cursor-pointer hover:border-gray-400 min-h-[105px]"
                >
                  {images[key] ? (
                    <img
                      src={URL.createObjectURL(images[key])}
                      alt="Secondary"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : existingImages[key] ? (
                    <img
                      src={existingImages[key].url}
                      alt={key}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <ImagePlus className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">
                        Image {index + 1}
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleImageChange(e, key)}
                  />
                </label>
              ))}
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                (closeModal(), resetForm());
              }}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="
    px-6 py-2.5 text-white font-medium rounded-lg transition-all duration-200
    bg-linear-to-r from-blue-600 to-blue-700
    hover:from-blue-700 hover:to-blue-800
    disabled:opacity-60 disabled:cursor-not-allowed
  "
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                  ? "Update"
                  : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCafe;
