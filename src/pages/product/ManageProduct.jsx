import React, { useState, useEffect, useContext } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { notifyError, notifySuccess } from "@/utils/notify";
import apiObj from "../../services/api";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { IoIosAdd } from "react-icons/io";
import { useLocation } from "react-router-dom";
const ManageProduct = () => {
  const baseUrl = import.meta.env.VITE_IMG_BASE_URL;
  const { showIcons, setShowIcons } = useContext(navOpen);
  const location = useLocation();
  const existingProduct = location?.state?.product;
  const editMode = existingProduct;
  let [categories, setCategories] = useState([]);
  let [subCategories, setSubCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: null,
    subCategory: "",
    productId: "",
    name: "",
    smallDesc: "",
    price: "",
    discount: "",
    status: "In Stock",
    qty: "",
    desc: "",
    images: [], // 5 images
    deletedImages : []
  });

  let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
  UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;

  let headers = {
    Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
  };

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  const getCategory = async () => {
    try {
      let result = await apiObj.getCategoryWithSubCat(headers);
      if (result.data.data && result.data.data.length > 0) {
        setCategories(result.data.data);
      } else {
        setCategories([]);
      }
      // console.log(result)
    } catch (err) {
      console.log(err);
      if (err.message && err.message == "Network Error") {
        setCategories([]);
      }
    }
  };
  useEffect(() => {
    getCategory();
  }, []);
  useEffect(() => {
    if (formData?.category) {
      let currentCat = categories?.find(
        (cat) => cat?._id == formData?.category
      );
      setSubCategories(currentCat?.subcategories || []);
    }
  }, [formData?.category, categories]);
  // set existing product in edit mode
  useEffect(() => {
    if (editMode && existingProduct) {
      console.log(existingProduct);
      setFormData({
        ...existingProduct,
        productId: existingProduct?.Id,
        category: existingProduct?.categoryId,
        subCategory: existingProduct?.subCategoryId,
        qty: existingProduct?.stock,
        desc: existingProduct?.description,
        images: existingProduct.images?.map((img) => `${baseUrl}${img}`) || [],
      });
    }
  }, [editMode, existingProduct]);

  // generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "category") {
      setFormData((prev) => ({ ...prev, subCategory: "" }));
    }
    if (
      [
        "breadth",
        "height",
        "length",
        "weight",
        "price",
        "discount",
        "qty",
      ].includes(name)
    ) {
      if (isNaN(value)) {
        // notifyError("Please input only number");
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

const removeImage = (index) => {
  setFormData((prev) => {
    const imgToRemove = prev.images[index];
    let updatedDeleted = prev.deletedImages || [];

    if (typeof imgToRemove === "string") {
      // Only add URL to deletedImages if it's from backend
      updatedDeleted = [...updatedDeleted, imgToRemove.replace(baseUrl, "")]; // send only relative path
    }

    return {
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      deletedImages: updatedDeleted,
    };
  });
};


  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData((prev) => ({ ...prev, desc: data }));
  };

  // save product
const saveProduct = async () => {
  if (!formData.category) return notifyError("Please select Category");
  if (!formData.productId) return notifyError("Please enter Product ID");
  if (!formData.name) return notifyError("Please enter Product Name");

  const data = new FormData();

  // Append main fields
  data.append("Id", formData.productId);
  data.append("name", formData.name);
  data.append("smallDesc", formData.smallDesc);
  data.append("description", formData.desc);
  data.append("categoryId", formData.category || "");
  data.append("subCategoryId", formData.subCategory || "");
  data.append("price", +formData.price);
  data.append("discount", +formData.discount);
  data.append("stock", +formData.qty);
  data.append("status", formData.status);

  // Existing images to keep (URLs only)
  const existingImages = formData.images
    .filter((img) => typeof img === "string")
    .map((img) => img.replace(baseUrl, "")); // only relative paths
  data.append("existingImages", JSON.stringify(existingImages));

  // New uploaded files
  formData.images
    .filter((img) => img instanceof File)
    .forEach((file) => data.append("images", file));

  // Deleted images
  data.append(
    "deletedImages",
    JSON.stringify(formData.deletedImages || [])
  );

  try {
    let result;
    if (editMode) {
      result = await apiObj.editProduct(formData._id, data, headers);
      notifySuccess("Product updated successfully");
    } else {
      result = await apiObj.createProduct(data, headers);
      notifySuccess("Product added successfully");
    }
    window.history.back();
  } catch (err) {
    console.log(err);
    notifyError("Something went wrong");
  }
};


  return (
    <div>
      <Layout>
        <div
          className={`
              ${
                showIcons
                  ? "md:w-[calc(100vw-292px)] w-[calc(100vw-17px)]"
                  : "md:w-[calc(100vw-102px)] w-[calc(100vw-17px)]"
              }
             duration-700  `}
        >
          <div className="p-4 w-full bg-gray-100 min-h-screen">
            <div className="flex  pb-3">
              <p
                className="cursor-pointer border-none text-[20px] hover py-1 px-2 border rounded-md  "
       
              >
                {editMode ? "Edit Product" : "Create Product"}
              </p>
            </div>
            <div className="mx-auto bg-white p-6 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 pt-5 sm:grid-cols-2 gap-4 w-full">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">
                    Select Category <span className="text-[red]">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category || ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                  >
                    <option value="">-- Select Category --</option>
                    {Array.isArray(categories) &&
                      categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* SubCategory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">
                    Select Sub Category
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory || ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                    disabled={!formData.category}
                  >
                    <option value="">-- Select Subcategory --</option>
                    {Array.isArray(subCategories) &&
                      subCategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Other inputs */}
                {[
                  { label: "Product ID", name: "productId" },
                  { label: "Product Name", name: "name" },
                  { label: "Small Desc", name: "smallDesc" },
                  { label: "Price", name: "price" },
                  { label: "Discount (%)", name: "discount" },
                  { label: "Qty", name: "qty" },
                ].map((field, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}{" "}
                      {[
                        "productId",
                        "name",
                        "breadth",
                        "height",
                        "length",
                        "weight",
                        "price",
                        "qty",
                      ].includes(field.name) && (
                        <span className="text-[red]">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                      placeholder={field.label}
                    />
                  </div>
                ))}

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                {/* Images */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Images
                  </label>
                  <div className="p-1 flex gap-3">
                    {formData.images.map((img, i) => (
                      <div
                        key={i}
                        className="w-[120px] h-[120px] rounded-md border cursor-pointer overflow-hidden relative"
                      >
                        <img
                          src={
                            img instanceof File ? URL.createObjectURL(img) : img
                          }
                          alt=""
                          className="w-[120px] h-[120px] object-cover"
                        />
                        <span
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(i);
                          }}
                        >
                          &times;
                        </span>
                      </div>
                    ))}
                    <input
                      type="file"
                      className="hidden"
                      id={`proimg`}
                      onChange={handleImageChange}
                    />
                    {formData.images?.length < 5 && (
                      <div
                        className="flex items-center gap-2 w-[120px] h-[120px] justify-center border rounded-md cursor-pointer"
                        onClick={() =>
                          document.getElementById("proimg").click()
                        }
                      >
                        <IoIosAdd className="text-[30px]" />
                        <p>Add</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CKEditor */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
              </div>
              <CKEditor
                editor={ClassicEditor}
                data={formData.desc || ""}
                onChange={handleEditorChange}
              />

              {/* Submit */}
              <div className="flex justify-end mt-6">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={saveProduct}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ManageProduct;
