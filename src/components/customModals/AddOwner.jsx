import React, { useState, useEffect } from "react";
import { X, Upload, User, Plus } from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const AddOwner = ({
  mode = "add",
  closeModal,
  selectedOwner = null,
  refetchAboutOwner,
}) => {
  const [isEditMode, setIsEditMode] = useState(mode === "edit");

  const [formData, setFormData] = useState({
    heading: "",
    ownerName: "",
    description: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingMediaUrl, setExistingMediaUrl] = useState(null);
  const MAX_SIZE = 9 * 1024 * 1024; // 9MB

  useEffect(() => {
    if (mode === "edit" && selectedOwner) {
      setIsEditMode(true);
      setFormData({
        heading: selectedOwner.heading || "",
        ownerName: selectedOwner.ownerName || "",
        description: selectedOwner.description || "",
      });
      const existingUrl = selectedOwner.ownerImage?.url || null;
      setExistingMediaUrl(existingUrl);
      setPhotoPreview(existingUrl); // 🔥 THIS IS IMPORTANT
    } else {
      setIsEditMode(false);
      resetForm();
    }
  }, [mode, selectedOwner]);

  /* =========================
       HANDLERS
    ========================= */
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // const handleRemovePhoto = () => {
  //     setPhoto(null);
  //     setPhotoPreview(null);
  // };

  const resetForm = () => {
    setFormData({ heading: "", ownerName: "", description: "" });
    setPhoto(null);
    setPhotoPreview(null);
  };

  /* ========== SUBMIT ============ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ✅ VALIDATE IMAGE SIZE FIRST
    if (photo && photo.size > MAX_SIZE) {
      toast.error(
        `Image is ${(photo.size / (1024 * 1024)).toFixed(
          2,
        )}MB. Max allowed is 9MB ❌`,
      );
      return;
    }
    setLoading(true);

    const data = new FormData();
    data.append("heading", formData.heading);
    data.append("ownerName", formData.ownerName);
    data.append("description", formData.description);
    data.append("mediaType", "image");

    if (photo) {
      data.append("ownerImage", photo);
    }

    const toastId = toast.loading(
      isEditMode ? "Updating About Owner..." : "Adding About Owner...",
    );

    try {
      if (isEditMode) {
        await api.put("/api/about-owner/edit-about-owner", data);
        toast.update(toastId, {
          render: "About Owner updated successfully ✅",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        await api.post("/api/about-owner/create-about-owner", data);
        toast.update(toastId, {
          render: "About Owner added successfully ✅",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }

      refetchAboutOwner?.();
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
            {isEditMode ? "Edit About Us" : "Add About Us"}
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
          <label className="group cursor-pointer inline-block">
            <div
              className="relative w-24 h-24 rounded-full border-2 border-dashed
                    flex items-center justify-center overflow-hidden
                    bg-gray-50 hover:bg-gray-100"
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
                                    opacity-0 group-hover:opacity-100"
                    >
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  )}
                </>
              ) : (
                <div className="relative">
                  <User className="w-10 h-10 text-gray-400" />
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6
                                bg-blue-600 text-white rounded-full
                                flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3" />
                  </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heading *
            </label>
            <input
              type="text"
              name="heading"
              required
              value={formData.heading}
              onChange={handleInputChange}
              placeholder="About Our Founder"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Name *
            </label>
            <input
              type="text"
              name="ownerName"
              required
              value={formData.ownerName}
              onChange={handleInputChange}
              placeholder="Enter ownerName"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description/Bio *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description about the team member's role, expertise, and experience..."
            />
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

export default AddOwner;
