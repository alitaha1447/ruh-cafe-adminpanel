import React, { useState, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Edit,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle,
  Plus,
} from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";
import AddContent from "../components/customModals/AddContent";

const ContentManagement = () => {
  // Website sections
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
      id: "franchise",
      name: "Franchise",
    },
    // {
    //     id: 'services',
    //     name: 'Services',
    // },
    // {
    //     id: 'contact',
    //     name: 'Contact Us',
    // },
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
    franchise: {
      selected: "border-purple-500 bg-purple-50 text-purple-700",
      unselected: "border-purple-200 bg-purple-25 hover:bg-purple-50",
    },
    // services: {
    //     selected: 'border-green-500 bg-green-50 text-green-700',
    //     unselected: 'border-green-200 bg-green-25 hover:bg-green-50',
    // },
    // contact: {
    //     selected: 'border-orange-500 bg-orange-50 text-orange-700',
    //     unselected: 'border-orange-200 bg-orange-25 hover:bg-orange-50',
    // },
  };

  const [selectedSection, setSelectedSection] = useState("home");
  const [selectedPage, setSelectedPage] = useState("home");
  const [showContentModal, setShowContentModal] = useState(false);
  const [generalContent, setGeneralContent] = useState({});
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [loading, setLoading] = useState(false);

  const fetchGeneralContent = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/api/general-content/get-general-content?page=${selectedSection}`,
      );
      //   console.log(res);
      setGeneralContent(res?.data?.data);
    } catch (error) {
      console.error(error);
      //   setGeneralContent({});
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGeneralContent();
  }, [selectedSection]);

  // Get current section
  const currentSection = websiteSections.find(
    (section) => section.id === selectedSection,
  );

  // Handle section change
  const handleSectionChange = (sectionId) => {
    setSelectedSection(sectionId);
  };

  const handleAdd = () => {
    setShowContentModal(true);
    setModalMode("add");
    // setSelectedPage(currentSection)
  };

  const handleEdit = () => {
    setShowContentModal(true);
    setModalMode("edit");
  };

  const hasContent = generalContent && Object.keys(generalContent).length > 0;
  console.log(hasContent);
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
      </div>
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {websiteSections.map((section) => {
            const isSelected = selectedSection === section.id;
            const colors = SECTION_COLORS[section.id];

            return (
              <div
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`flex-1 min-w-[180px] p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
          ${isSelected ? colors.selected : colors.unselected}
        `}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold text-base ${
                      isSelected ? "" : "text-gray-800"
                    }`}
                  >
                    {section.name}
                  </span>

                  {/* {savedBanners[section.id] && (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    )} */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="w-full sm:flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                Add Content {currentSection.name}
              </h2>
            </div>
            {hasContent ? (
              <button
                onClick={handleEdit}
                style={{ width: "" }}
                className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Edit Content
              </button>
            ) : (
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white font-medium rounded-lg hover: hover:bg-blue-800 transition-all duration-200 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Add Content
              </button>
            )}
          </div>
        </div>
        {/*  */}
        <div className="mt-6">
          {loading ? (
            <p className="text-gray-500">Loading content...</p>
          ) : hasContent ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              {/* <h4 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
              Primary Section
            </h4> */}
              {/* LOGO */}
              {generalContent.logo?.url && (
                <img
                  src={generalContent.logo.url}
                  alt="Logo"
                  className="h-16 object-contain"
                />
              )}

              {/* HEADING */}
              <h3 className="text-2xl font-bold text-gray-900">
                {generalContent.heading}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-gray-700 leading-relaxed">
                {generalContent.description}
              </p>

              {/* MEDIA */}

              {generalContent?.media?.url &&
                (generalContent.media.mediaType === "image" ? (
                  <img
                    src={generalContent.media.url}
                    alt="Media"
                    className="w-full rounded-lg"
                  />
                ) : (
                  <video
                    src={generalContent.media.url}
                    controls
                    className="w-full rounded-lg"
                  />
                ))}
              {/* SECONDARY HEADING / DESCRIPTION */}

              {/* DELETE BUTTON */}
              <div className="flex justify-end pt-4 border-t">
                <button
                  disabled={loading}
                  onClick={() => handleDelete(generalContent)}
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
      </div>
      <AddContent
        isModalOpen={showContentModal}
        closeModal={() => setShowContentModal(false)}
        mode={modalMode} // 'add' or 'edit'
        selectedSection={selectedSection}
        selectedContent={generalContent} // ✅ ADD THIS
        // selectedContent={selectedContent}
        refreshList={fetchGeneralContent} // Pass the refresh function
      />
    </div>
  );
};

export default ContentManagement;
