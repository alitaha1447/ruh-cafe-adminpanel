import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, X, User } from "lucide-react";
import api from "../api/axios";
import AddThreeViewer from "../components/customModals/AddThreeViewer";
import { toast } from "react-toastify";

const ThreeDViewer = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [loading, setLoading] = useState(false);
  const [threeD, setThreeD] = useState({});
  const [selectedThreeD, setSelectedThreeD] = useState({});

  const handleAdd = () => {
    setActiveModal(true);
    setModalMode("add");
  };

  const handleEdit = () => {
    setActiveModal(true);
    setModalMode("edit");
    // setSelectedThreeD(threeD);
  };

  const fetchThreeD = async () => {
    const res = await api.get(`/api/threeD-image/get-3D-image?page=home`);
    console.log(res.data.data);
    setThreeD(res.data.data);
  };
  useEffect(() => {
    fetchThreeD();
  }, []);

  const handleDelete = (data) => {
    // setDeletingId(id);
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
              onClick={() => confirmDeleteContent(data._id, closeToast)}
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

  const confirmDeleteContent = async (id, closeToast) => {
    closeToast(); // close confirmation toast
    setLoading(true);
    // setDeletingId(id);
    const toastId = toast.loading("Deleting content...");

    try {
      await api.delete(`/api/threeD-image/delete-3D-image/${id}`);

      toast.update(toastId, {
        render: "Content deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      await fetchThreeD();
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: error?.message || "Delete failed",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
      //   setDeletingId(null);
    }
  };

  const hasAbout = threeD && Object.keys(threeD).length > 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Owner</h1>
        </div>
        {hasAbout ? (
          <button
            onClick={handleEdit}
            style={{ width: "" }}
            className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Edit 360' Viewer Image
          </button>
        ) : (
          <button
            onClick={handleAdd}
            style={{ width: "" }}
            className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add 360' Viewer Image
          </button>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500">Loading content...</p>
        ) : hasAbout ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            {/* MEDIA */}

            {threeD?.media?.url &&
              (threeD.media.mediaType === "image" ? (
                <img
                  src={threeD?.media?.url}
                  alt="Media"
                  className="w-full rounded-lg"
                />
              ) : (
                <video
                  src={threeD.media.url}
                  controls
                  className="w-full rounded-lg"
                />
              ))}

            {/* DELETE BUTTON */}
            <div className="flex justify-end pt-4 border-t">
              <button
                disabled={loading}
                onClick={() => handleDelete(threeD)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 italic">
            No content added for this section.
          </p>
        )}
      </div>
      {activeModal && (
        <AddThreeViewer
          mode={modalMode}
          closeModal={() => setActiveModal(null)}
          //   selectedOwner={selectedOwner}
        />
      )}
    </div>
  );
};

export default ThreeDViewer;
