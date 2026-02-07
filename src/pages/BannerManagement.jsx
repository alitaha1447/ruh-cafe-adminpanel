import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  User,
  Monitor,
  Smartphone,
  Save,
  RotateCcw,
} from "lucide-react";
import AddMenuBanner from "../components/customModals/AddMenuBanner";
import api from "../api/axios";
import { toast } from "react-toastify";

const BannerManagement = () => {
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
      id: "contact",
      name: "Contact Us",
    },
    {
      id: "franchise",
      name: "Franchise",
    },
    {
      id: "career",
      name: "Career",
    },
    {
      id: "liveMusic",
      name: "Live Music",
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
    contact: {
      selected: "border-orange-500 bg-orange-50 text-orange-700",
      unselected: "border-orange-200 bg-orange-25 hover:bg-orange-50",
    },
    franchise: {
      selected: "border-green-500 bg-green-50 text-green-700",
      unselected: "border-green-200 bg-green-25 hover:bg-green-50",
    },
    career: {
      selected: "border-red-500 bg-red-50 text-red-700",
      unselected: "border-red-200 bg-red-25 hover:bg-red-50",
    },
    liveMusic: {
      selected: "border-blue-500 bg-blue-50 text-blue-700",
      unselected: "border-blue-200 bg-blue-25 hover:bg-blue-50",
    },
  };

  const [selectedSection, setSelectedSection] = useState("home");
  const [showContentModal, setShowContentModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [activeTab, setActiveTab] = useState("mainBanner");
  const [bannerType, setBannerType] = useState(null);
  const [loadingBannerType, setLoadingBannerType] = useState(true);
  // MAIN BANNER

  const [showAddMainBanner, setShowAddMainBanner] = useState(false);

  const [desktopPreview, setDesktopPreview] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobileUploading, setIsMobileUploading] = useState(false);
  const [desktopBanners, setDesktopBanners] = useState([]);
  const [mobileBanners, setMobileBanners] = useState([]);

  const [selectedDesktopBanners, setSelectedDesktopBanners] = useState([]);
  const [loadingBannerId, setLoadingBannerId] = useState(null);
  const [selectedMobileBanners, setSelectedMobileBanners] = useState([]);
  const [loadingMobileBannerId, setLoadingMobileBannerId] = useState(null);

  const [savedBanners, setSavedBanners] = useState({
    desktop: null,
    mobile: null,
  });

  // Get current section
  const currentSection = websiteSections.find(
    (section) => section.id === selectedSection,
  );

  const MAX_SIZE = 9 * 1024 * 1024; // 9MB

  const handleSectionChange = (sectionId) => {
    setSelectedSection(sectionId);
  };
  const handleAdd = () => {
    setShowContentModal(true);
    setModalMode("add");
    // setSelectedPage(currentSection)
  };

  const handleEdit = (content) => {
    setShowContentModal(true);
    setModalMode("edit");
    setSelectedContent(content);
  };

  const fetchContents = async () => {
    try {
      const res = await api.get(
        `/api/contents/get-content?page=${currentSection?.id}`,
      );

      setContents(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [selectedSection]);

  const handleDelete = (id) => {
    setDeletingId(id);
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
              onClick={() => confirmDeleteContent(id, closeToast)}
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
    // setLoading(true);
    setDeletingId(id);
    const toastId = toast.loading("Deleting content...");

    try {
      await api.delete(`/api/contents/delete-content/${id}`);

      toast.update(toastId, {
        render: "Content deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      await fetchContents();
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: error?.message || "Delete failed",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      // setLoading(false);
      setDeletingId(null);
    }
  };

  // MAIN BANNER ADD FUNCTIONALITY
  // Handle file upload
  const handleFileUpload = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "video/mp4",
    ];

    if (!validTypes.includes(file.type)) {
      alert("Please upload JPG, PNG, WebP image or MP4 video");
      return;
    }

    // store file for upload
    setSavedBanners((prev) => ({
      ...prev,
      [type]: file,
    }));

    // preview
    const previewUrl = URL.createObjectURL(file);
    const isVideo = file.type === "video/mp4";

    if (type === "desktop") {
      setDesktopPreview({
        url: previewUrl,
        isVideo,
      });
    } else {
      setMobilePreview({
        url: previewUrl,
        isVideo,
      });
    }
  };

  // Reset banners
  const handleResetBanners = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all banners for this section?",
      )
    ) {
      setDesktopPreview(null);
      setMobilePreview(null);
    }
  };

  // Remove image
  const handleRemoveImage = (type) => {
    if (type === "desktop") {
      setDesktopPreview(null);
    } else {
      setMobilePreview(null);
    }
  };

  // Save Main Desktop Banners
  const handleSaveMainDesktopBanners = async () => {
    setIsUploading(true);

    if (!desktopPreview) {
      alert("Please upload desktop banner image");
      setIsUploading(false);
      return;
    }

    // ✅ FRONTEND SIZE VALIDATION
    if (savedBanners.desktop && savedBanners.desktop.size > MAX_SIZE) {
      toast.error("File size should not exceed 9MB ❌");
      setIsUploading(false);
      return;
    }
    const toastId = toast.loading("Uploading Desktop Banner...");

    try {
      const formData = new FormData();

      if (savedBanners.desktop) {
        formData.append("desktop", savedBanners.desktop);
        formData.append(
          "desktopMediaType",
          savedBanners.desktop.type.startsWith("video/") ? "video" : "image",
        );
      }

      // for (let [key, value] of formData.entries()) {
      //   if (value instanceof File) {
      //     console.log(`${key}:`, {
      //       name: value.name,
      //       type: value.type,
      //       // size: value.size,
      //     });
      //   } else {
      //     console.log(`${key}:`, value);
      //   }
      // }

      const res = await api.post(
        `/api/main-desktop-banner/upload-main-desktopBanner?page=${currentSection?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      // alert("Uploaded successfully");
      toast.update(toastId, {
        render: "Desktop banner uploaded successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      await fetchMainDesktopBanner();
      handleResetBanners();
    } catch (error) {
      console.log("Error while uploading banner --> ", error);
      toast.update(toastId, {
        render: error?.response?.data?.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setIsUploading(false);
    }
  };
  // FETCH MAIN DESKTOP BANNER
  const fetchMainDesktopBanner = async () => {
    try {
      const res = await api.get(
        `/api/main-desktop-banner/get-main-desktopBanner?page=${currentSection?.id}`,
      );

      setDesktopBanners(res?.data?.data);
      const preSelectedIds = res?.data?.data
        .filter((banner) => banner.isSelected === true)
        .map((banner) => banner._id);

      setSelectedDesktopBanners(preSelectedIds);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeTab !== "mainBanner") return;
    if (!currentSection?.id) return;

    fetchMainDesktopBanner();
  }, [activeTab, currentSection?.id]);

  const handleDeleteDesktopBanner = async (id) => {
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
              onClick={() => confirmMainDesktopBannerDelete(id, closeToast)}
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
  const confirmMainDesktopBannerDelete = async (id, closeToast) => {
    closeToast(); // close confirmation toast

    const toastId = toast.loading("Deleting Banner...");

    try {
      await api.delete(
        `/api/main-desktop-banner/delete-main-desktopBanner/${id}`,
      );

      toast.update(toastId, {
        render: "Banner deleted successfully 🗑️",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      await fetchMainDesktopBanner();
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: error?.response?.data?.message || "Failed to delete banner ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // selected desktop banners
  const toggleSelectDesktopBanner = async (id) => {
    setLoadingBannerId(id);
    const isCurrentlySelected = selectedDesktopBanners.includes(id);
    const nextState = !isCurrentlySelected;

    // ✅ Update UI instantly
    setSelectedDesktopBanners((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

    const toastId = toast.loading(
      nextState ? "Showing banner on home..." : "Removing banner from home...",
    );
    try {
      await api.patch(
        "/api/main-desktop-banner/update-main-desktopBanner-byId",
        {
          ids: [id],
          isSelected: nextState,
        },
      );
      toast.update(toastId, {
        render: "Banner updated successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
    } catch (error) {
      console.error(error);
      // ❌ Rollback UI on failure
      setSelectedDesktopBanners((prev) =>
        nextState ? prev.filter((item) => item !== id) : [...prev, id],
      );

      toast.update(toastId, {
        render: "Failed to update banner ❌",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setLoadingBannerId(null);
    }
  };

  // ===== MAIN MOBILE BANNER ADD FUNCTIONALITY =====
  const handleSaveMainMobileBanners = async () => {
    setIsMobileUploading(true);

    if (!mobilePreview) {
      alert("Please upload mobile banner image");
      setIsMobileUploading(false);
      return;
    }
    if (savedBanners.mobile && savedBanners.mobile.size > MAX_SIZE) {
      toast.error("File size should not exceed 9MB ❌");
      setIsMobileUploading(false);
      return;
    }
    const toastId = toast.loading("Uploading Mobile Banner...");

    try {
      const formData = new FormData();

      if (savedBanners.mobile) {
        formData.append("mobile", savedBanners.mobile);
        formData.append(
          "mobileMediaType",
          savedBanners.mobile.type.startsWith("video/") ? "video" : "image",
        );
      }

      const res = await api.post(
        `/api/main-mobile-banner/upload-main-mobileBanner?page=${currentSection?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      // alert("Uploaded successfully");
      toast.update(toastId, {
        render: "Mobile banner uploaded successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      await fetchMainMobileBanner();
      handleResetBanners();
    } catch (error) {
      console.log("Error while uploading banner --> ", error);
      toast.update(toastId, {
        render: error?.response?.data?.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setIsMobileUploading(false);
    }
  };

  const fetchMainMobileBanner = async () => {
    try {
      const res = await api.get(
        `/api/main-mobile-banner/get-main-mobileBanner?page=${currentSection?.id}`,
      );

      setMobileBanners(res?.data?.data);
      const preSelectedIds = res?.data?.data
        .filter((banner) => banner.isSelected === true)
        .map((banner) => banner._id);

      setSelectedMobileBanners(preSelectedIds);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeTab !== "mainBanner") return;
    if (!currentSection?.id) return;

    fetchMainMobileBanner();
  }, [activeTab, currentSection?.id]);

  const handleDeleteMobileBanner = async (id) => {
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
              onClick={() => confirmMainMobileBannerDelete(id, closeToast)}
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
  const confirmMainMobileBannerDelete = async (id, closeToast) => {
    closeToast(); // close confirmation toast

    const toastId = toast.loading("Deleting Banner...");

    try {
      await api.delete(
        `/api/main-mobile-banner/delete-main-mobileBanner/${id}`,
      );

      toast.update(toastId, {
        render: "Banner deleted successfully 🗑️",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      await fetchMainMobileBanner();
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: error?.response?.data?.message || "Failed to delete banner ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const toggleSelectMobileBanner = async (id) => {
    setLoadingMobileBannerId(id);
    const isCurrentlySelected = selectedMobileBanners.includes(id);
    const nextState = !isCurrentlySelected;

    // ✅ Update UI instantly
    setSelectedMobileBanners((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

    const toastId = toast.loading(
      nextState ? "Showing banner on home..." : "Removing banner from home...",
    );
    try {
      await api.patch("/api/main-mobile-banner/update-main-mobileBanner-byId", {
        ids: [id],
        isSelected: nextState,
      });
      toast.update(toastId, {
        render: "Banner updated successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
    } catch (error) {
      console.error(error);
      // ❌ Rollback UI on failure
      setSelectedMobileBanners((prev) =>
        nextState ? prev.filter((item) => item !== id) : [...prev, id],
      );

      toast.update(toastId, {
        render: "Failed to update banner ❌",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setLoadingMobileBannerId(null);
    }
  };

  // =============================================

  useEffect(() => {
    const fetchBannerType = async () => {
      try {
        const res = await api.get("/api/banner-types/get-banner-type");
        setBannerType(res.data.activeBannerType); // main | menu
      } catch (err) {
        console.error(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchBannerType();
  }, []);

  const updateBannerType = async (type) => {
    try {
      const res = await api.patch("/api/banner-types/modify-banner-type", {
        activeBannerType: type,
      });
      console.log(res);
    } catch (error) {
      console.error("Failed to update banner type", error);
    }
  };

  const handleBannerTypeChange = async (type) => {
    if (type === bannerType) return;
    setBannerType(type);
    await updateBannerType(type);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Banner Management
          </h1>
        </div>
        <div className="flex items-center gap-6 mb-6">
          <span className="text-sm font-semibold text-gray-700">
            Banner Type:
          </span>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="bannerType"
              value="main"
              checked={bannerType === "main"}
              // onChange={() => setBannerType("main")}
              onChange={() => handleBannerTypeChange("main")}
              className="h-4 w-4 accent-blue-600"
            />
            <span className="text-sm text-gray-800">Main Banner</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="bannerType"
              value="menu"
              checked={bannerType === "menu"}
              // onChange={() => setBannerType("menu")}
              onChange={() => handleBannerTypeChange("menu")}
              className="h-4 w-4 accent-blue-600"
            />
            <span className="text-sm text-gray-800">Menu Banner</span>
          </label>
        </div>

        <div>
          <div className="w-full my-2 sm:w-auto flex justify-end">
            <div className="relative inline-flex w-full max-w-xs sm:w-auto rounded-full bg-gray-100 p-1 sm:p-1.5 border border-blue-500">
              <span
                className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] rounded-full bg-blue-500 shadow-md transition-all duration-300 ease-out
                    ${
                      activeTab === "menuBanner"
                        ? "translate-x-[calc(100%-0.25rem)] sm:translate-x-[calc(100%-0.5rem)] w-1/2"
                        : "translate-x-0 w-1/2"
                    }`}
              />
              <button
                type="button"
                onClick={() => setActiveTab("mainBanner")}
                className={`relative z-10 flex-1 px-4 sm:px-5 py-1.5 sm:py-2 text-sm font-medium rounded-full
                    transition-colors text-center whitespace-nowrap min-w-[70px]
                    ${
                      activeTab === "mainBanner"
                        ? "text-white font-semibold"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
              >
                Main banner
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("menuBanner")}
                className={`relative z-10 flex-1 px-4 sm:px-5 py-1.5 sm:py-2 text-sm font-medium rounded-full
                    transition-colors text-center whitespace-nowrap min-w-[70px]
                    ${
                      activeTab === "menuBanner"
                        ? "text-gray-900 font-semibold"
                        : "text-gray-600 hover:text-gray-800"
                    }
                                                `}
              >
                Menu Banner
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*  */}

      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {websiteSections
            .filter((section) =>
              activeTab === "menuBanner" ? section.id === "home" : true,
            )
            .map((section) => {
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

      {/*  */}

      {/*  */}

      {activeTab === "menuBanner" && (
        <>
          <div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="w-full sm:flex-1">
                    <h2 className="text-xl font-bold text-gray-900">
                      Add Menu Banner {currentSection.name}
                    </h2>
                  </div>

                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white font-medium rounded-lg hover: hover:bg-blue-800 transition-all duration-200 cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                    Add Content
                  </button>
                </div>
              </div>
            </div>
            {/*  */}
            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {currentSection.name} Menu Banners List
              </h3>
              <div className="">
                {/* Desktop Banner list */}
                <div>
                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          {" "}
                          Heading{" "}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          {" "}
                          Description{" "}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          {" "}
                          Banner{" "}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          {" "}
                          Media Type{" "}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          {" "}
                          Action{" "}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {contents?.length > 0 ? (
                        contents.map((banner, index) => (
                          <tr
                            key={banner._id || index}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 capitalize">
                                {banner.heading}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 capitalize">
                                {banner.description}
                              </span>
                            </td>
                            {banner?.media?.mediaType === "image" ? (
                              <td className="px-4 py-3">
                                <img
                                  src={banner?.media?.url}
                                  alt="Desktop Banner"
                                  className="h-16 w-32 rounded-md object-contain border border-gray-200 shadow-sm"
                                />
                              </td>
                            ) : (
                              <td className="px-4 py-3">
                                <video
                                  src={banner?.url}
                                  alt="Desktop Banner"
                                  className="h-16 w-32 rounded-md object-cover border border-gray-200 shadow-sm"
                                />
                              </td>
                            )}
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 capitalize">
                                {banner.media?.mediaType}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEdit(banner)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                {/* <button
                            disabled={deleteLoading}
                            onClick={() => handleDelete(branch?._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button> */}
                                <button
                                  // disabled={loading}
                                  disabled={deletingId === banner._id}
                                  onClick={() => handleDelete(banner?._id)}
                                  className={`
    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
    ${
      deletingId === banner._id
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-red-50 text-red-600 hover:bg-red-100"
    }
  `}
                                >
                                  {/* {loading ? "Deleting..." : "Delete"} */}
                                  {deletingId === banner._id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </div>
                            </td>
                            {/* <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedDesktopBanners.includes(banner._id)}
                          onChange={() => toggleSelectDesktopBanner(banner._id)}
                          disabled={loadingBannerId === banner._id}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-6 text-center text-sm text-gray-500"
                          >
                            No banners available for this section.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "mainBanner" && (
        <div>
          {/* Add Content */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="w-full sm:flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    Add Main Banner {currentSection.name}
                  </h2>
                </div>

                <button
                  onClick={() => setShowAddMainBanner((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white font-medium rounded-lg hover: hover:bg-blue-800 transition-all duration-200 cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Add Main Banner
                </button>
              </div>
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out p-6
    ${
      showAddMainBanner
        ? "max-h-auto opacity-100 translate-y-0"
        : "max-h-0 opacity-0 -translate-y-4"
    }`}
            >
              {/* Desktop & Mobile Upload in Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Desktop Banner Upload */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Monitor className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Desktop Banner
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-2 transition-colors
                  ${
                    desktopPreview
                      ? "border-green-200 bg-green-50"
                      : "border-gray-300 hover:border-blue-400 bg-white"
                  }`}
                  >
                    {desktopPreview ? (
                      <div className="space-y-4">
                        <div className="relative rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                          {desktopPreview.isVideo ? (
                            <video
                              src={desktopPreview.url}
                              controls
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <img
                              src={desktopPreview.url}
                              alt="Desktop Banner Preview"
                              className="w-full h-48 object-cover"
                            />
                          )}

                          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleRemoveImage("desktop")}
                              className="p-3 bg-white/90 rounded-lg hover:bg-white shadow-lg"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                          <Upload className="w-10 h-10 text-gray-400" />
                        </div>
                        <label className="block mb-3">
                          {/* <span className="text-gray-600">Drag & drop or</span> */}
                          <span className="text-blue-600 cursor-pointer hover:text-blue-700 ml-1 font-medium">
                            browse files
                          </span>
                          <input
                            id="desktop-upload"
                            type="file"
                            className="hidden"
                            accept="image/*,video/mp4"
                            onChange={(e) => handleFileUpload("desktop", e)}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Banner Upload */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Smartphone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Mobile Banner
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`border-2 border-dashed rounded-xl p-2 transition-colors
                                            ${
                                              mobilePreview
                                                ? "border-green-200 bg-green-50"
                                                : "border-gray-300 hover:border-blue-400 bg-white"
                                            }`}
                  >
                    {mobilePreview ? (
                      <div className="space-y-4">
                        <div className="relative rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                          {mobilePreview.isVideo ? (
                            <video
                              src={mobilePreview.url}
                              controls
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <img
                              src={mobilePreview.url}
                              alt="Mobile Banner Preview"
                              className="w-full h-48 object-cover"
                            />
                          )}

                          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleRemoveImage("mobile")}
                              className="p-3 bg-white/90 rounded-lg hover:bg-white shadow-lg"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                          <Upload className="w-10 h-10 text-gray-400" />
                        </div>
                        <label className="block mb-3">
                          <span className="text-gray-600">Drag & drop or</span>
                          <span className="text-blue-600 cursor-pointer hover:text-blue-700 ml-1 font-medium">
                            browse files
                          </span>
                          <input
                            id="mobile-upload"
                            type="file"
                            className="hidden"
                            accept="image/*,video/mp4"
                            onChange={(e) => handleFileUpload("mobile", e)}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-2 mt-4">
                <button
                  onClick={handleSaveMainDesktopBanners}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isUploading ? "Saving..." : "Save Desktop Banner"}
                </button>
                <button
                  onClick={handleResetBanners}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset All
                </button>
                <button
                  onClick={handleSaveMainMobileBanners}
                  disabled={isMobileUploading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isMobileUploading ? "Saving..." : "Save Mobile Banner"}
                </button>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="mt-10">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {currentSection.name} Main Banners List
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Desktop Banner list */}
              <div>
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Desktop Banner
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Media Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Select Media
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {desktopBanners?.length > 0 ? (
                      desktopBanners.map((banner, index) => (
                        <tr
                          key={banner._id || index}
                          className="hover:bg-gray-50 transition"
                        >
                          {banner?.desktop.mediaType === "image" ? (
                            <td className="px-4 py-3">
                              <img
                                src={banner.desktop?.url}
                                alt="Desktop Banner"
                                className="h-16 w-32 rounded-md object-contain border border-gray-200 shadow-sm"
                              />
                            </td>
                          ) : (
                            <td className="px-4 py-3">
                              <video
                                src={banner.desktop?.url}
                                alt="Desktop Banner"
                                className="h-16 w-32 rounded-md object-cover border border-gray-200 shadow-sm"
                              />
                            </td>
                          )}

                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 capitalize">
                              {banner.desktop.mediaType}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleDeleteDesktopBanner(
                                    banner?._id,
                                    "desktop",
                                  )
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedDesktopBanners.includes(
                                banner._id,
                              )}
                              onChange={() =>
                                toggleSelectDesktopBanner(banner._id)
                              }
                              disabled={loadingBannerId === banner._id}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-6 text-center text-sm text-gray-500"
                        >
                          No banners available for this section.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Mobile Banner list */}
              <div>
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Mobile Banner
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Media Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Select Media
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white">
                    {mobileBanners?.length > 0 ? (
                      mobileBanners.map((banner, index) => (
                        <tr
                          key={banner._id || index}
                          className="hover:bg-gray-50 transition"
                        >
                          {banner?.mobile?.mediaType === "image" ? (
                            <td className="px-4 py-3">
                              <img
                                src={banner?.mobile?.url}
                                alt="Mobile Banner"
                                className="h-16 w-32 rounded-md object-contain border border-gray-200 shadow-sm"
                              />
                            </td>
                          ) : (
                            <td className="px-4 py-3">
                              <video
                                src={banner.mobile?.url}
                                alt="Mobile Banner"
                                className="h-16 w-32 rounded-md object-cover border border-gray-200 shadow-sm"
                              />
                            </td>
                          )}

                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 capitalize">
                              {banner.mobile.mediaType}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleDeleteMobileBanner(banner?._id)
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedMobileBanners.includes(
                                banner._id,
                              )}
                              onChange={() =>
                                toggleSelectMobileBanner(banner._id)
                              }
                              disabled={loadingMobileBannerId === banner._id}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-6 text-center text-sm text-gray-500"
                        >
                          No banners available for this section.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {showContentModal && (
        <AddMenuBanner
          closeModal={() => setShowContentModal(false)}
          mode={modalMode}
          selectedSection={selectedSection}
          selectedContent={selectedContent}
          refetch={fetchContents}
        />
      )}
    </div>
  );
};

export default BannerManagement;
