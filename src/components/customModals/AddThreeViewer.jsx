import React, { useState, useEffect } from "react";
import { X, Upload, User, Plus } from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import axios from "axios";

const AddThreeViewer = ({ mode = "add", closeModal, selectedOwner = null }) => {
  const [isEditMode, setIsEditMode] = useState(mode === "edit");

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  /* ========== SUBMIT ============ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("mediaType", "image");

    if (photo) {
      data.append("media", photo);
    }

    // const toastId = toast.loading(
    //   isEditMode ? "Updating About Owner..." : "Adding About Owner...",
    // );

    try {
      if (isEditMode) {
        // await api.put("/api/about-owner/edit-about-owner", data);
        // toast.update(toastId, {
        //   render: "About Owner updated successfully ✅",
        //   type: "success",
        //   isLoading: false,
        //   autoClose: 2000,
        // });
        console.log(isEditMode);
      } else {
        await api.post("/api/threeD-image/upload-3D-image?page=home", data);
        // toast.update(toastId, {
        //   render: "About Owner added successfully ✅",
        //   type: "success",
        //   isLoading: false,
        //   autoClose: 2000,
        // });
      }

      //   refreshData?.();
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
            {isEditMode ? "Edit 360' Image" : "Add 360' Image"}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image */}
          <label className="group cursor-pointer block">
            <div
              className="relative w-full h-48 rounded-xl border-2 border-dashed
               flex items-center justify-center overflow-hidden
               bg-gray-50 hover:bg-gray-100 transition"
            >
              {photoPreview ? (
                <>
                  <img
                    key={photoPreview}
                    src={photoPreview}
                    onLoad={() => setImageLoaded(true)}
                    className="w-full h-full object-cover"
                  />

                  {imageLoaded && (
                    <div
                      className="absolute inset-0 bg-black/40
                       flex items-center justify-center
                       opacity-0 group-hover:opacity-100 transition"
                    >
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Upload className="w-8 h-8 mb-2" />
                  <p className="text-sm">Upload Image</p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoUpload}
            />
          </label>

          {/* Heading */}

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
              className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddThreeViewer;
