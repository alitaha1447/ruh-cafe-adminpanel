import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Upload, X, User } from "lucide-react";
import AddSEO from "../components/customModals/AddSEO";
import api from "../api/axios";

const SEO = () => {
  const websiteSections = [
    {
      id: "home",
      name: "Home Page",
    },
    {
      id: "about",
      name: "About Us",
    },
    {
      id: "menu",
      name: "Menu",
    },
    {
      id: "gallery",
      name: "Gallery",
    },
    {
      id: "contact",
      name: "Contact Us",
    },
  ];
  // Color mapping for Tailwind CSS classes
  const SECTION_COLORS = {
    home: {
      selected: "border-red-500 bg-red-50 text-red-700",
      unselected: "border-red-200 bg-red-25 hover:bg-red-50",
    },
    about: {
      selected: "border-blue-500 bg-blue-50 text-blue-700",
      unselected: "border-blue-200 bg-blue-25 hover:bg-blue-50",
    },
    menu: {
      selected: "border-purple-500 bg-purple-50 text-purple-700",
      unselected: "border-purple-200 bg-purple-25 hover:bg-purple-50",
    },
    gallery: {
      selected: "border-green-500 bg-green-50 text-green-700",
      unselected: "border-green-200 bg-green-25 hover:bg-green-50",
    },
    contact: {
      selected: "border-orange-500 bg-orange-50 text-orange-700",
      unselected: "border-orange-200 bg-orange-25 hover:bg-orange-50",
    },
  };

  const [activeModal, setActiveModal] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedSection, setSelectedSection] = useState("home");
  const [seo, setSeo] = useState({});
  const [selectedSEO, setSelectedSEO] = useState(null);

  const handleSectionChange = (sectionId) => {
    setSelectedSection(sectionId);
  };
  const currentSection = websiteSections.find(
    (section) => section.id === selectedSection,
  );

  const handleAdd = () => {
    setActiveModal(true);
    setModalMode("add");
    setSelectedSEO(null);
  };

  const fetchAboutCafe = async () => {
    try {
      const res = await api.get(
        `/api/seo/get-seo-by-slug/${currentSection?.id}`,
      );

      setSeo(res?.data?.data || {});
    } catch (error) {
      if (error.response?.status === 404) {
        // ✅ SEO not created yet — NOT an error
        setSeo({});
      } else {
        console.error("Failed to fetch SEO:", error);
      }
    }
  };

  useEffect(() => {
    fetchAboutCafe();
  }, [currentSection?.id]);

  const handleEdit = () => {
    setActiveModal(true);
    setModalMode("edit");
    setSelectedSEO(seo);
  };

  const hasSEO = seo && Object.keys(seo).length > 0;

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {websiteSections.map((section) => {
            const isSelected = selectedSection === section.id;
            const colors = SECTION_COLORS[section.id];

            return (
              <div
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`flex-1 w-auto p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
          ${isSelected ? colors.selected : colors.unselected}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold text-base ${
                      isSelected ? "" : "text-gray-800"
                    }`}
                  >
                    {section.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO</h1>
        </div>
        {hasSEO ? (
          <button
            onClick={handleEdit}
            style={{ width: "" }}
            className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Edit SEO
          </button>
        ) : (
          <button
            onClick={handleAdd}
            style={{ width: "" }}
            className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add SEO
          </button>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">SEO Details</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {seo && seo._id ? (
                <tr className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-800">1</td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {seo.title}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                    {seo.description}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-800">
                      {seo.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      //   disabled={loading}
                      onClick={() => handleDelete(seo?._id)}
                      className={`
    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
  
  `}
                    >
                      {/* {loading ? "Deleting..." : "Delete"} */}
                      {/* {deletingId === banner._id ? "Deleting..." : "Delete"} */}
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    No SEO data found for this section
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeModal && (
        <AddSEO
          mode={modalMode}
          closeModal={() => setActiveModal(null)}
          selectedSection={currentSection}
          seoData={selectedSEO} // ✅ IMPORTANT
          refreshData={fetchAboutCafe}
        />
      )}
    </div>
  );
};

export default SEO;
