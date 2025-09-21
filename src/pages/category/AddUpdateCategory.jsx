import React, { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import apiObj from "../../services/api";
import { toast } from "react-toastify";

const AddUpdateCategory = ({
  viewAddCategory,
  setViewAddCategory,
  getCategory,
  editCategoryData,
}) => {
  const baseUrl = import.meta.env.VITE_IMG_BASE_URL
  const UNIKARIADMIN = JSON.parse(localStorage.getItem("UNIKARIADMIN") || "{}");
  const headers = { Authorization: `Bearer ${UNIKARIADMIN?.token || ""}` };

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  // Form state
  const [categoryData, setCategoryData] = useState({
    categoryName: "",
    categoryImg: null,
    categoryIcon: null,
    categoryBanners: [],
    categoryImgUrl: "",
    categoryIconUrl: "",
    categoryBannersUrl: [],
    deletedBanners: [],
    deletedMainImage: null,
  });

  // Populate form for edit
  useEffect(() => {
    if (editCategoryData) {
      setCategoryData({
        categoryName: editCategoryData.name || "",
        categoryImg: null,
        categoryIcon: null,
        categoryBanners: [],
        categoryImgUrl: editCategoryData.catImg ? `${baseUrl}${editCategoryData.catImg}` : "",
        categoryIconUrl: editCategoryData.catIconImg ? `${baseUrl}${editCategoryData.catIconImg}` : "",
        categoryBannersUrl: editCategoryData.catBanners
          ? editCategoryData.catBanners.map((banner) => `${baseUrl}${banner}`)
          : [],
        deletedBanners: [],
        deletedMainImage: null,
      });
    }
  }, [editCategoryData]);

  // Convert name to slug
  const convertToSlug = (text) =>
    text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  // Handle text changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "categoryBanners") {
      setCategoryData((prev) => ({
        ...prev,
        categoryBanners: [
          ...prev.categoryBanners,
          ...Array.from(files).slice(
            0,
            5 - prev.categoryBanners.length - prev.categoryBannersUrl.length
          ),
        ],
      }));
    } else {
      setCategoryData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // Remove banner (old or new)
  const removeBanner = (index) => {
    if (index < categoryData.categoryBannersUrl.length) {
      // Old banner
      setCategoryData((prev) => ({
        ...prev,
        deletedBanners: [
          ...prev.deletedBanners,
          prev.categoryBannersUrl[index].replace(baseUrl, ""),
        ],
        categoryBannersUrl: prev.categoryBannersUrl.filter((_, i) => i !== index),
      }));
    } else {
      // New banner
      const newIndex = index - categoryData.categoryBannersUrl.length;
      setCategoryData((prev) => ({
        ...prev,
        categoryBanners: prev.categoryBanners.filter((_, i) => i !== newIndex),
      }));
    }
  };

  // Remove main image
  const removeMainImage = () => {
    if (categoryData.categoryImgUrl) {
      setCategoryData((prev) => ({
        ...prev,
        deletedMainImage: prev.categoryImgUrl.replace(baseUrl, ""),
        categoryImgUrl: "",
      }));
    } else {
      setCategoryData((prev) => ({ ...prev, categoryImg: null }));
    }
  };


const submitCategory = async () => {
  const {
    categoryName,
    categoryImg,
    categoryIcon,
    categoryBanners,
    deletedBanners,
    deletedMainImage,
  } = categoryData;

  if (!categoryName) return notifyError("Please enter category name");
  if (!categoryImg && !categoryData.categoryImgUrl)
    return notifyError("Please select category image");

  try {
    const data = new FormData();
    data.append("name", categoryName);
    data.append("slugName", convertToSlug(categoryName));

    // New main image
    if (categoryImg) data.append("catImg", categoryImg);
    // New icon
    if (categoryIcon) data.append("catIconImg", categoryIcon);
    // New banners
    categoryBanners.forEach((file) => data.append("catBanners", file));
    // Deleted banners info (old banners to delete)
    if (deletedBanners.length) data.append("deletedBanners", JSON.stringify(deletedBanners));
    // Deleted main image (old main image to delete)
    if (deletedMainImage) data.append("deletedMainImage", deletedMainImage);

    let result;
    if (editCategoryData) {
      result = await apiObj.editCategory(editCategoryData._id, data, headers);
      notifySuccess("Category updated successfully");
    } else {
      result = await apiObj.createCategory(data, headers);
      notifySuccess("Category created successfully");
    }

    getCategory();
    setCategoryData({
      categoryName: "",
      categoryImg: null,
      categoryIcon: null,
      categoryBanners: [],
      categoryImgUrl: "",
      categoryIconUrl: "",
      categoryBannersUrl: [],
      deletedBanners: [],
      deletedMainImage: null,
    });
    setViewAddCategory(false);
  } catch (err) {
    notifyError(err?.response?.data?.message || "Something went wrong");
    console.log(err);
  }
};


  return (
    <div
      className={`${
        viewAddCategory ? "fixed" : "hidden"
      } h-[90vh] max-h-[600px] max-w-[500px] w-[90vw] z-50 bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md overflow-auto`}
    >
      <p className="bg-[#f5f5f9] p-2 text-[#696cff] text-center font-bold fixed w-full top-0 right-0">
        {editCategoryData ? "Edit Category" : "Add Category"}
      </p>

      <div className="pt-[40px] px-4">
        {/* Name */}
        <div className="mb-3">
          <p className="font-medium pb-1">Category Name:</p>
          <input
            type="text"
            name="categoryName"
            className="w-full py-2 px-3 border rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
            placeholder="Category name"
            value={categoryData.categoryName}
            onChange={handleChange}
          />
        </div>

        {/* Main Image */}
        <div className="mb-3">
          <p className="font-medium pb-1">Category Image:</p>
          <input
            type="file"
            name="categoryImg"
            id="categoryImg"
            className="hidden"
            onChange={handleFileChange}
          />
          <div
         className="w-full py-2 px-3 border rounded-md flex items-center justify-center h-[100px] cursor-pointer"
            onClick={() => document.getElementById("categoryImg").click()}
          >
            {!categoryData.categoryImg && !categoryData.categoryImgUrl ? (
              <div className="flex items-center gap-2">
                <div className="bg-white h-[50px] w-[50px] rounded-md flex items-center justify-center">
                  <IoIosAdd className="text-[40px]" />
                </div>
                <p>Add Image</p>
              </div>
            ) : (
              <div className="relative  h-full">
                <img
                  src={
                    categoryData.categoryImg
                      ? URL.createObjectURL(categoryData.categoryImg)
                      : categoryData.categoryImgUrl
                  }
                  alt=""
                  className="max-h-[80px] rounded-md border  object-cover"
                />
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMainImage();
                  }}
                >
                  &times;
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Icon Image */}
        <div className="mb-3">
          <p className="font-medium pb-1">Category Icon:</p>
          <input
            type="file"
            name="categoryIcon"
            id="categoryIcon"
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            className="w-full py-2 px-3 border rounded-md flex items-center justify-center h-[100px] cursor-pointer"
            onClick={() => document.getElementById("categoryIcon").click()}
          >
            {!categoryData.categoryIcon && !categoryData.categoryIconUrl ? (
              <p className="text-gray-400">Click to add icon</p>
            ) : (
              <img
                src={
                  categoryData.categoryIcon
                    ? URL.createObjectURL(categoryData.categoryIcon)
                    : categoryData.categoryIconUrl
                }
                alt=""
                className="max-h-[80px] rounded-md border"
              />
            )}
          </div>
        </div>

        {/* Banners */}
        <div className="mb-3">
          <p className="font-medium pb-1">Category Banners (max 5):</p>
          <input
            type="file"
            name="categoryBanners"
            id="categoryBanners"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            className="w-full py-2 px-3 border rounded-md flex flex-wrap gap-2 min-h-[100px] cursor-pointer"
            onClick={() =>
              categoryData.categoryBanners.length + categoryData.categoryBannersUrl.length < 5
                ? document.getElementById("categoryBanners").click()
                : null
            }
          >
            {[...categoryData.categoryBannersUrl, ...categoryData.categoryBanners].map(
              (file, idx) => (
                <div key={idx} className="relative w-full max-h-[160px] ">
                  <img
                    src={typeof file === "string" ? file : URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full  rounded-md border object-cover"
                  />
                  <span
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBanner(idx);
                    }}
                  >
                    &times;
                  </span>
                </div>
              )
            )}
            {[...categoryData.categoryBannersUrl, ...categoryData.categoryBanners].length < 5 && (
              <div className="flex items-center gap-2 w-[120px] h-[120px] justify-center border rounded-md cursor-pointer">
                <IoIosAdd className="text-[30px]" />
                <p>Add</p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="py-3">
          <button
            className="bg-[#696cff] w-full text-white p-2 rounded-md hover:font-semibold hover:bg-[#5d60f7]"
            onClick={submitCategory}
          >
            {editCategoryData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUpdateCategory;
