import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, X, User } from "lucide-react";
import AddOwner from "../components/customModals/AddOwner";
import api from "../api/axios";

const AboutOwner = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [loading, setLoading] = useState(false);
  const [aboutOwner, setAboutOwner] = useState({});
  const [selectedOwner, setSelectedOwner] = useState({});

  const handleAdd = () => {
    setActiveModal(true);
    setModalMode("add");
  };

  const handleEdit = () => {
    setActiveModal(true);
    setModalMode("edit");
    setSelectedOwner(aboutOwner);
  };

  const fetchAboutOwner = async () => {
    const res = await api.get(`/api/about-owner/get-about-owner`);

    setAboutOwner(res.data.data[0]);
  };
  useEffect(() => {
    fetchAboutOwner();
  }, []);

  const hasAbout = aboutOwner && Object.keys(aboutOwner).length > 0;

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
            Edit Details
          </button>
        ) : (
          <button
            onClick={handleAdd}
            style={{ width: "" }}
            className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Details
          </button>
        )}
      </div>
      {/* About Owner */}
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : aboutOwner ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Owner Section */}
          <div className="flex items-center gap-6">
            <img
              src={aboutOwner?.ownerImage?.url}
              alt={aboutOwner.ownerName}
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {aboutOwner.ownerName}
              </h2>
              <p className="text-gray-600">{aboutOwner.heading}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Founder Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {aboutOwner.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">
          No About Us data found. Please add details.
        </div>
      )}

      {activeModal && (
        <AddOwner
          mode={modalMode}
          closeModal={() => setActiveModal(null)}
          selectedOwner={selectedOwner}
          refetchAboutOwner={fetchAboutOwner}
        />
      )}
    </div>
  );
};

export default AboutOwner;
