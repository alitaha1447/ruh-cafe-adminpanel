import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Upload, X, User } from "lucide-react";
import AddCafe from "../components/customModals/AddCafe";
import api from "../api/axios";

const AboutCafe = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [loading, setLoading] = useState(false);
  const [aboutCafe, setAboutCafe] = useState({});
  const [selectedData, setSelectedData] = useState({});

  const handleAdd = () => {
    setActiveModal(true);
    setModalMode("add");
  };

  const fetchAboutCafe = async () => {
    const res = await api.get(`/api/about-cafe/get-about-cafe`);

    setAboutCafe(res?.data?.data);
  };
  useEffect(() => {
    fetchAboutCafe();
  }, []);

  const handleEditAboutCafe = (aboutCafe) => {
    setActiveModal(true);
    setModalMode("edit");
    setSelectedData(aboutCafe);
  };

  const hasAboutCafe = aboutCafe && Object.keys(aboutCafe).length > 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Cafe</h1>
        </div>
        {hasAboutCafe ? (
          <button
            // onClick={handleEditClick}
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
      {/*  */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  S.No
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Heading
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Desccription
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Images
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {aboutCafe?.images?.length > 0 ? (
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">1</td>

                  <td className="px-6 py-4 text-gray-800">
                    {aboutCafe.heading}
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    {aboutCafe.description}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {aboutCafe.images.map((img, index) => (
                        <div
                          key={img._id}
                          className="w-20 h-14 rounded-md overflow-hidden border border-gray-200"
                          title={img.slot}
                        >
                          {img.mediaType === "video" ? (
                            <video
                              src={img.url}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={img.url}
                              alt={img.slot}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                        onClick={() => handleEditAboutCafe(aboutCafe)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                        // onClick={() => handleDeleteAboutCafe(aboutCafe._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No Data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {activeModal && (
        <AddCafe
          mode={modalMode}
          closeModal={() => setActiveModal(null)}
          selectedData={selectedData}
          refreshData={fetchAboutCafe}
        />
      )}
    </div>
  );
};

export default AboutCafe;
