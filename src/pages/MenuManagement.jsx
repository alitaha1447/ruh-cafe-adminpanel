import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Upload, X, User } from "lucide-react";
import AddCategory from "../components/customModals/AddCategory";
import AddDish from "../components/customModals/AddDish";
import api from "../api/axios";
import { toast } from "react-toastify";

const MenuManagement = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);

  const hanldeAdd = (type) => {
    setModalMode("add");
    setActiveModal(type);
  };

  const handleEdit = (type, selectedData) => {
    setModalMode("edit");
    setActiveModal(type); // ✅ FIXED
    if (type === "category") {
      setSelectedCategory(selectedData);
      setSelectedDish(null); // clear other
    }
    if (type === "dish") {
      setSelectedDish(selectedData);
    }
  };

  const fetchcategories = async () => {
    try {
      const res = await api.get(`/api/categories/get-categories`);
      setCategories(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchcategories();
  }, []);

  const fetchDishes = async (categoryId) => {
    try {
      const res = await api.get(`/api/dishes/get-dishes/${categoryId}`);
      setDishes(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDish = (dish) => {
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
              onClick={() => confirmDeleteContent(dish._id, closeToast)}
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
    // setDeletingId(id);
    const toastId = toast.loading("Deleting content...");

    try {
      await api.delete(`/api/dishes/delete-dish/${id}`);

      toast.update(toastId, {
        render: "Dish deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      if (selectedCategory?._id) {
        fetchDishes(selectedCategory._id);
      }
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
      // setDeletingId(null);
    }
  };

  // useEffect(() => {
  //   if (selectedCategory?._id) {
  //     fetchDishes(selectedCategory._id);
  //   }
  // }, [selectedCategory?._id]);

  // 👇 stable refetch wrapper
  const refetchDishes = () => {
    if (selectedCategory?._id) {
      fetchDishes(selectedCategory._id);
    }
  };

  useEffect(() => {
    refetchDishes();
  }, [selectedCategory?._id]);

  return (
    <div className=" my-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Menu List</h1>
      </div>
      <div className="flex  flex-col md:flex-row gap-4">
        <div className=" w-full md:w-1/2">
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
              <h1 className="text-sm font-semibold text-gray-800">
                Categories List
              </h1>
              <button
                onClick={() => hanldeAdd("category")}
                className="btn btn-sm btn-primary"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            <div className="divide-y divide-gray-200 p-4 text-sm text-gray-600">
              {categories.map((category) => (
                <div
                  key={category._id}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex justify-between items-center py-2 px-2 rounded-md cursor-pointer
    ${
      selectedCategory?._id === category._id
        ? "bg-blue-50 text-blue-700 font-medium"
        : "hover:bg-gray-50"
    }`}
                >
                  {" "}
                  <div className="flex items-center gap-3">
                    {category.categoryMedia?.url ? (
                      <img
                        src={category.categoryMedia.url}
                        alt={category.categoryName}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        N/A
                      </div>
                    )}

                    <span className="font-medium">{category.categoryName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit("category", category);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className=" w-full md:w-1/2">
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
              <h1 className="text-sm font-semibold text-gray-800">
                {selectedCategory
                  ? `Dishes – ${selectedCategory.categoryName}`
                  : "Dish List"}
                {/* Dish List */}
              </h1>

              <button
                disabled={!selectedCategory}
                onClick={() => hanldeAdd("dish")}
                className="btn btn-sm btn-primary"
              >
                <Plus className="w-4 h-4" />
                Add Dishes
              </button>
            </div>

            <div className="divide-y divide-gray-200 text-sm text-gray-700">
              {dishes.length > 0 ? (
                dishes.map((dish) => (
                  <div
                    key={dish._id}
                    className={`flex justify-between items-start px-4 py-3 gap-4
          ${
            selectedCategory?._id === dish._id
              ? "bg-blue-50 border-l-4 border-blue-500"
              : "hover:bg-gray-50"
          }`}
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        {/* <p className="font-semibold text-gray-900">
                          {dish.dishName}
                        </p> */}

                        <div className="flex items-center gap-3">
                          {dish.dishMedia?.url ? (
                            <img
                              src={dish.dishMedia.url}
                              alt={dish.dishName}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                              N/A
                            </div>
                          )}

                          <span className="font-medium">{dish.dishName}</span>
                        </div>

                        {/* {(dish.halfPrice || dish.fullPrice) && (
                          <span className="text-sm font-semibold text-gray-900">
                            ₹{dish.fullPrice || "-"}
                            <span className="mx-1 text-gray-400">/</span>₹
                            {dish.halfPrice || "-"}
                            <span className="text-xs text-gray-500 ml-1">
                              (Full / Half)
                            </span>
                          </span>
                        )} */}
                      </div>

                      {dish.description && (
                        <p className="text-xs text-gray-500 mt-1 leading-snug">
                          {dish.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit("dish", dish);
                        }}
                        className="p-2 rounded-md text-blue-600 hover:bg-blue-100"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDish(dish);
                        }}
                        className="p-2 rounded-md text-red-600 hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-6">
                  No dishes found for this category.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {activeModal === "category" && (
        <AddCategory
          mode={modalMode}
          closeModal={() => setActiveModal(null)}
          selectedCategory={selectedCategory}
          refetch={async () => await fetchcategories()}
        />
      )}
      {activeModal === "dish" && (
        <AddDish
          mode={modalMode}
          closeModal={() => setActiveModal(null)}
          selectedCategory={selectedCategory}
          selectedDish={selectedDish}
          refetch={refetchDishes}
        />
      )}
    </div>
  );
};

export default MenuManagement;
