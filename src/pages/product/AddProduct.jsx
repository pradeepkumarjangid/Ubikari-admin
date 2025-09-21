import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import noImg from "/img/no-image.png";
import apiObj from "../../services/api";
import { toast } from "react-toastify";
import { SiMaxplanckgesellschaft } from "react-icons/si";
import Desc from "../../components/Desc";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../components/custom-editor-styles.css";
import { IoCloseSharp } from "react-icons/io5";
export default function AddProduct() {
  const { showIcons, setShowIcons } = useContext(navOpen);
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);
  let [inProcess, setInProcess] = useState(false);
  const [excelData, setExcelData] = useState(false);
  const [viewExcel, setViewExcel] = useState(false);
  const [file, setFile] = useState(false);
  const [categories, setCategories] = useState(false);
  const [subCategories, setSubCategories] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState(false);
  const [img1, setImg1] = useState(false);
  const [img2, setImg2] = useState(false);
  const [img3, setImg3] = useState(false);
  const [img4, setImg4] = useState(false);
  const [img5, setImg5] = useState(false);
  const [name, setName] = useState();
  const [height, setHeight] = useState();
  const [length, setLength] = useState();
  const [breadth, setBreadth] = useState();
  const [status, setStatus] = useState("In Stock");
  const [weight, setWeight] = useState();
  const [qty, setQty] = useState();
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState();
  const [desc, setDesc] = useState();
  const [metal, setMetal] = useState();
  const [productId, setProductId] = useState();
  const [purity, setPurity] = useState();
  const [metalWeight, setMetalWeight] = useState();

  let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
  UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
  
  let headers = {
    Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setDesc(data);
  };

  const getCategory = async () => {
    try {
      let result = await apiObj.getCategory(headers);
      if (result.data.categories && result.data.categories.length > 0) {
        setCategories(result.data.categories);
      } else {
        setCategories("no data");
      }
      // console.log(result)
    } catch (err) {
      console.log(err);
      if (err.message && err.message == "Network Error") {
        setCategories("Network");
      }
    }
  };

  const getSubCategoryOfACategory = async (id) => {
    try {
      let result = await apiObj.getSubCategoryOfACategory(id);
      if (result.data.subcategories && result.data.subcategories.length > 0) {
        setSubCategories(result.data.subcategories);
      } else {
        setSubCategories("no data");
      }
      // console.log(result)
    } catch (err) {
      console.log(err);
      if (err.message && err.message == "Network Error") {
        setSubCategories("Network");
      }
      if (
        err.response &&
        err.response.data.error == "No subcategories found for this category"
      ) {
        setSubCategories("no data");
      }
    }
  };

  const addProduct = async () => {
    console.log(currentSubCategory);
    // return
    let images = [img1, img2, img3, img4];
    let data = new FormData();
    data.append("Id", productId);
    data.append("name", name);
    data.append("description", desc);
    data.append("categoryId", currentCategory ? currentCategory._id : null);
    data.append("catId", currentCategory ? currentCategory.catId : null);
    data.append("categoryName", currentCategory ? currentCategory.name : null);
    data.append(
      "catSlugName",
      currentCategory ? currentCategory.slugName : null
    );

    data.append("status", status);
    data.append("breadth", +breadth);
    data.append("height", +height);
    data.append("length", +length);
    data.append("weight", +weight);
    data.append("price", +price);
    data.append("discount", +discount);
    data.append("stock", +qty);
    data.append("metalType", metal);
    // data.append("purity " , purity)
    // data.append("metalWeigth " , metalWeight)
    data.append("image1", img1);
    data.append("image2", img2);
    data.append("image3", img3);
    data.append("image4", img4);
    data.append("image5", img5);
    if (currentSubCategory) {
      data.append(
        "subCatName",
        currentSubCategory ? currentSubCategory.name : null
      );
      data.append(
        "subCategoryId",
        currentSubCategory ? currentSubCategory._id : null
      );
      data.append(
        "subCatId",
        currentSubCategory ? currentSubCategory.subCatId : null
      );
      data.append(
        "subCatSlugName",
        currentSubCategory ? currentSubCategory.subCatSlugName : null
      );
    }
    console.log(images);
    if (!currentCategory) {
      notifyError("Please select Category");
    } else if (!name) {
      notifyError("Please enter Product Name");
    } else if (!productId) {
      notifyError("Please enter product ID");
    } else if (!currentCategory) {
      notifyError("Please select category");
    } else if (!length) {
      notifyError("Please enter product length");
    } else if (!height) {
      notifyError("Please enter product height");
    } else if (!breadth) {
      notifyError("Please enter product breadth");
    } else if (!weight) {
      notifyError("Please enter product weight");
    } else if (!price) {
      notifyError("Please enter product price");
    } else {
      try {
        let result = await apiObj.createProduct(data, headers);
        console.log(result);
        notifySuccess("Product added successfully");
        window.history.back();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const saveInventoryExcel = async () => {
    if (!file) {
      notifyError("Please select a file first!");
      return;
    }
    setInProcess(true);

    const formData = new FormData();
    formData.append("file", file);
    try {
      let result = await apiObj.uploadProductExcel(formData, headers);
      console.log(result);
      if (
        result.data.message &&
        result.data.message == "You don't have permission to add new inventory."
      ) {
        notifyError("You don't have access to add Inventory");
        setInProcess(false);
      } else {
        setInProcess(false);
        setExcelData(result.data);
        notifySuccess(
          `Successfull ${result.data.savedCount} & failed ${result.data.failedCount}`
        );
      }
    } catch (err) {
      console.log(err);
    }
    // console.log(file)
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Capture the selected file
  };
  useEffect(() => {
    getCategory();
  }, []);


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
            <div className="flex justify-end pb-3">
              <p
                className="cursor-pointer text-[20px] hover py-1 px-2 border rounded-md border-[#696cff] bg-[#696cff] text-white"
                onClick={() => setViewExcel(true)}
              >
                Import Bulk{" "}
              </p>
            </div>

            <div className=" mx-auto bg-white p-6 rounded-lg shadow-lg">
              {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create Product</h2> */}
              <div className="grid grid-cols-1 pt-5 sm:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">
                    Select Category <span className="text-[red]">*</span>
                  </label>
                  <div
                    type="text"
                    className="mt-1 p-2 block  border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md h-[120px]  overflow-auto px-4"
                  >
                    {categories == false ? (
                      <p className={` cursor-pointer px-3 text-center`}>
                        Please wait...
                      </p>
                    ) : categories == "no data" ? (
                      <p className={` px-3 text-center`}>Please add category</p>
                    ) : categories == "Network" ? (
                      <p>Network Error</p>
                    ) : (
                      categories.map((category, index) => (
                        <p
                          className={`${
                            currentCategory &&
                            currentCategory._id == category._id
                              ? "bg-[#696cff] text-white"
                              : ""
                          }  cursor-pointer px-3`}
                          key={index}
                          onClick={() => {
                            getSubCategoryOfACategory(category._id);
                            setCurrentCategory(category);
                          }}
                        >
                          {category.name}
                        </p>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 ">
                    Select Sub Category <span className="text-[red]">*</span>
                  </label>
                  <div
                    type="text"
                    className="mt-1 p-2 block  border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md h-[120px]  overflow-auto px-4"
                  >
                    {subCategories == false ? (
                      <p className={` cursor-pointer px-3 text-center`}>
                        First please select category
                      </p>
                    ) : subCategories == "no data" ? (
                      <p className={` px-3 text-center`}>No Sub Categories</p>
                    ) : subCategories == "Network" ? (
                      <p>Network Error</p>
                    ) : (
                      subCategories.map((category, index) => (
                        <p
                          className={`${
                            currentSubCategory &&
                            currentSubCategory._id == category._id
                              ? "bg-[#696cff] text-white"
                              : ""
                          }  cursor-pointer px-3`}
                          key={index}
                          onClick={() => setCurrentSubCategory(category)}
                        >
                          {category.name}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 pt-5 sm:grid-cols-2 gap-4 w-full">
                {/* Left Column */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">
                    Product ID<span className="text-[red]">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                    placeholder="Product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">
                    Product Name <span className="text-[red]">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Breadth (cm) <span className="text-[red]">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                    placeholder="Breadth"
                    value={breadth}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        setBreadth(e.target.value);
                      } else {
                        notifyError("Please input only number");
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Height (cm) <span className="text-[red]">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                    placeholder="Height"
                    value={height}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        setHeight(e.target.value);
                      } else {
                        notifyError("Please input only number");
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Length (cm) <span className="text-[red]">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                    placeholder="Length"
                    value={length}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        setLength(e.target.value);
                      } else {
                        notifyError("Please input only number");
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Weight (kg) <span className="text-[red]">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                    placeholder="Weight (kg)"
                    value={weight}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        setWeight(e.target.value);
                      } else {
                        notifyError("Please input only number");
                      }
                    }}
                  />
                </div>

                {/* Discount and Visibility */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price <span className="text-[red]">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        setPrice(e.target.value);
                      } else {
                        notifyError("Please input only number");
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount (%)
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                    placeholder="Discount (%)"
                    value={discount}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        setDiscount(e.target.value);
                      } else {
                        notifyError("Please input only number");
                      }
                    }}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value={"In Stock"}>In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Qty <span className="text-[red]">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                    placeholder="Quantity"
                    value={qty}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        setQty(e.target.value);
                      } else {
                        notifyError("Please input only number");
                      }
                    }}
                  />
                </div>

                {/* Metal  */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Metal
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md"
                    value={metal}
                    onChange={(e) => setMetal(e.target.value)}
                  ></input>
                </div>
                {/* <div>
            <label className="block text-sm font-medium text-gray-700">Purity / Karat</label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Purity / Karat"  value={purity} onChange={(e)=>setPurity(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Metal Weight (grm)</label>
            <input type="text" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-[#696cff] focus:outline-none focus:shadow-md" placeholder="Metal Weight (grm)" value={metalWeight} onChange={(e)=>{
              if(!isNaN(e.target.value)){
                setMetalWeight(e.target.value)
              }else{
                notifyError("Please input only number")
              }
              
              }} />
          </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Images
                  </label>
                  <div className="p-1 flex gap-3 ">
                    {/* img1 */}
                    <div
                      className="h-[45px] w-[45px] rounded-md border cursor-pointer overflow-hidden"
                      onClick={() => document.getElementById("img1").click()}
                    >
                      <input
                        type="file"
                        className="hidden"
                        id="img1"
                        onChange={(e) =>
                          e.target.files[0] && e.target.files[0] instanceof Blob
                            ? setImg1(e.target.files[0])
                            : setImg1(false)
                        }
                      />
                      <img
                        src={
                          img1 && img1 instanceof Blob
                            ? URL.createObjectURL(img1)
                            : noImg
                        }
                        alt=""
                        className="h-[45px] w-[45px]"
                      />
                    </div>

                    {/* img2 */}
                    <div
                      className="h-[45px] w-[45px] rounded-md border cursor-pointer overflow-hidden"
                      onClick={() => document.getElementById("img2").click()}
                    >
                      <input
                        type="file"
                        className="hidden"
                        id="img2"
                        onChange={(e) =>
                          e.target.files[0] && e.target.files[0] instanceof Blob
                            ? setImg2(e.target.files[0])
                            : setImg2(false)
                        }
                      />
                      <img
                        src={img2 ? URL.createObjectURL(img2) : noImg}
                        alt=""
                        className="h-[45px] w-[45px]"
                      />
                    </div>

                    {/* img3 */}
                    <div
                      className="h-[45px] w-[45px] rounded-md border cursor-pointer overflow-hidden"
                      onClick={() => document.getElementById("img3").click()}
                    >
                      <input
                        type="file"
                        className="hidden"
                        id="img3"
                        onChange={(e) =>
                          e.target.files[0] && e.target.files[0] instanceof Blob
                            ? setImg3(e.target.files[0])
                            : setImg3(false)
                        }
                      />
                      <img
                        src={img3 ? URL.createObjectURL(img3) : noImg}
                        alt=""
                        className="h-[45px] w-[45px]"
                      />
                    </div>

                    {/* img4 */}
                    <div
                      className="h-[45px] w-[45px] rounded-md border cursor-pointer overflow-hidden"
                      onClick={() => document.getElementById("img4").click()}
                    >
                      <input
                        type="file"
                        className="hidden"
                        id="img4"
                        onChange={(e) =>
                          e.target.files[0] && e.target.files[0] instanceof Blob
                            ? setImg4(e.target.files[0])
                            : setImg4(false)
                        }
                      />
                      <img
                        src={img4 ? URL.createObjectURL(img4) : noImg}
                        alt=""
                        className="h-[45px] w-[45px]"
                      />
                    </div>

                    {/* img5 */}
                    <div
                      className="h-[45px] w-[45px] rounded-md border cursor-pointer overflow-hidden"
                      onClick={() => document.getElementById("img5").click()}
                    >
                      <input
                        type="file"
                        className="hidden"
                        id="img5"
                        onChange={(e) =>
                          e.target.files[0] && e.target.files[0] instanceof Blob
                            ? setImg5(e.target.files[0])
                            : setImg5(false)
                        }
                      />
                      <img
                        src={img5 ? URL.createObjectURL(img5) : noImg}
                        alt=""
                        className="h-[45px] w-[45px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
              </div>

              <CKEditor
                className="ck-editor__editable_inline"
                editor={ClassicEditor}
                data={desc}
                config={{
                  extraPlugins: [
                    function (editor) {
                      editor.on("ready", () => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "padding",
                            "20px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                      });
                    },
                  ],
                }}
                onChange={handleEditorChange}
              />

              <div className="flex justify-end mt-6">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={addProduct}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${
            viewExcel ? "fixed" : "hidden"
          }  z-40 opacity-35 top-0 left-0 w-full h-full bg-black`}
          onClick={() => setViewExcel(false)}
        ></div>

        {viewExcel ? (
          <div className=" fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[600px] h-[90vh] max-h-[600px]   overflow-auto scrollbar border border-[#696cff] z-40  bg-white p-5">
            <div className="relative">
              {/* close excel */}
              <IoCloseSharp
                className={`absolute z-40 right-3 cursor-pointer ${
                  inProcess ? "text-white" : "text-black"
                } `}
                onClick={() => {
                  setInProcess(false);
                  setViewExcel(false);
                }}
              />

              <p className="text-center">Upload Excel Sheet</p>
              <p className="text-center"></p>

              <div className="border mt-10 border-black rounded-sm p-5 h-full">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />{" "}
                {/* File input */}
                <p className="py-6 pb-0 px-3 flex justify-end">
                  <button
                    className="bg-[#696cff] py-1 px-4 rounded-md text-white "
                    onClick={saveInventoryExcel}
                  >
                    Upload
                  </button>
                </p>
              </div>

              <div
                className={`${
                  excelData ? "" : "hidden"
                } border border-t-0 h-full border-black`}
              >
                <p className="p-3 text-center ">Uploaded Data</p>

                <p className="px-3">
                  SuccessFull {excelData ? excelData.savedCount : 0} and failed{" "}
                  {excelData ? excelData.failedCount : 0}
                </p>

                {excelData && excelData.failedCount > 0 ? (
                  <p className="text-center">Failed Inventories</p>
                ) : null}

                {excelData && excelData.failedCount > 0 ? (
                  <div className="border-b p-2 flex items-center gap-5 font-[600]">
                    <p className="w-[50px]  ">Sr No.</p>
                    <p className="w-[120px]  ">Product Id</p>
                    <p className="min-w-[200px]">error</p>
                  </div>
                ) : null}
                {excelData && excelData.failedCount > 0
                  ? excelData.failedItems.map((item, index) => (
                      <div className="border-b p-2 flex items-center gap-5">
                        <p className="w-[50px] text-center ">{index + 1}</p>
                        <p className="w-[120px]  ">{item.item.Id}</p>
                        <p className="min-w-[200px]">{item.error}</p>
                      </div>
                    ))
                  : null}
              </div>

              <div
                className={`${
                  inProcess ? "" : "hidden"
                } opacity-80 top-0 left-0 w-full h-full`}
              >
                <p className="text-black text-center p-6">Please Wait...</p>
              </div>
            </div>
          </div>
        ) : null}
      </Layout>
    </div>
  );
}
