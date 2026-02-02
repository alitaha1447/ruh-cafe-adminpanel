import React, { useState, useEffect } from "react";
import api from "../api/axios";

export const enquirySections = [
  {
    id: "career",
    name: "Career Enquiry",
  },
  {
    id: "franchise",
    name: "Franchise Enquiry",
  },
];
export const SECTION_COLORS = {
  career: {
    selected: "border-blue-500 bg-blue-50 text-blue-700",
    unselected: "border-blue-200 bg-blue-25 hover:bg-blue-50",
  },
  franchise: {
    selected: "border-blue-500 bg-blue-50 text-blue-700",
    unselected: "border-blue-200 bg-blue-25 hover:bg-blue-50",
  },
};

const FormManagement = () => {
  const [selectedSection, setSelectedSection] = useState("career");
  const [enquiries, setEnquiries] = useState([]);

  const handleSectionChange = (sectionId) => {
    setSelectedSection(sectionId);
  };

  // Get current section
  const currentSection = enquirySections.find(
    (section) => section.id === selectedSection,
  );
  console.log(currentSection);

  // Get Enquiries
  const fetchEnquiries = async () => {
    const res = await api.get(
      `/api/enquiry/get-enquiry?enquiryType=${currentSection?.id}`,
    );
    console.log(res?.data?.data);
    setEnquiries(res?.data?.data);
  };
  useEffect(() => {
    fetchEnquiries();
  }, [currentSection?.id]);

  const formatDate = (dateInput) => {
    if (!dateInput) return "";

    const date = new Date(dateInput);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Form Management</h1>
      </div>
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {enquirySections.map((section) => {
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Enquiry Type
                </th>
                {currentSection?.id === "franchise" && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    City
                  </th>
                )}
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enquiries.length > 0 ? (
                enquiries.map((enquiry, index) => {
                  return (
                    <tr
                      key={enquiry._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {enquiry.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {enquiry.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {enquiry.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {enquiry.enquiryType}
                          </p>
                        </div>
                      </td>
                      {currentSection.id === "franchise" && (
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {enquiry?.city || "Null"}
                            </p>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatDate(enquiry.createdAt)}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No Enquiry available for this section.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FormManagement;
