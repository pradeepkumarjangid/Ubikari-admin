import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { navOpen } from "../../App";
import { Button } from "antd";
import DynamicModal from "../../components/DynamicModal";
import { Form, Formik } from "formik";
import TextInput from "../../components/FormikInputs/TextInput";
import ImgUpload from "../../components/FormikInputs/ImgUpload";
import apiObj from "../../services/api";
import { toast } from "react-toastify";
import * as Yup from "yup";
import DynamicTable from "../../components/DynamicTable";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { showConfirm } from "../../utility/confirmBox";

const Homebanners = () => {
  const { showIcons, setShowIcons } = useContext(navOpen);
  const baseUrl = import.meta.env.VITE_IMG_BASE_URL;
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);
  let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
  UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
  let headers = {
    Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
  };

  const [state, setState] = useState();
  const [dataSource, setDataSource] = useState([]);

  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setState({ open: false });
  };
  const getBanners = async () => {
    setLoading(true);
    try {
      let res = await apiObj.getAllBanners(headers);
      setLoading(false);
      console.log(res);
      if (res?.data?.banners) {
        let data =  res?.data?.banners?.map((item) => ({
            title: item?.title,
            bannerImage: `${baseUrl}${item?.imageUrl}`,
            id: item?._id,
          })) || []
        setDataSource([...data]);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const BannerSchema = Yup.object().shape({
    bannerTitle: Yup.string().required("Banner title is required"),
    bannerImage: Yup.mixed()
      .required("Banner image is required")
      .test("fileExists", "A file must be selected", (value) => value !== null),
  });
  const bannerColumns = [
    {
      title: "S.No.",
      dataIndex: "serial",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Banner Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Banner Image",
      dataIndex: "bannerImage",
      key: "bannerImage",
      render: (imageUrl) => (
        <img
          src={imageUrl}
          alt="Banner"
          className="w-20 h-12 object-cover rounded"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600 hover:underline"
            onClick={() =>
              setState({
                open: true,
                record,
              })
            }
          >
            <EditOutlined />
          </button>
          <button
            className="text-red-600 hover:underline"
            onClick={() => deleteBanner(record)}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  const addBanner = async (values) => {
    let formData = new FormData();
    formData.append("title", values?.bannerTitle);
    formData.append("image", values?.bannerImage);

    try {
      let res =  state?.record 
        ? await apiObj?.updateBanner(state?.record?.id, formData, headers)
        : await apiObj.createNewbanner(formData, headers);
      // console.log(res)
      notifySuccess(res?.data?.message);
      getBanners();
      closeModal();
    } catch (err) {
      console.log(err);
      notifyError(err?.message);
    }
  };
  const deleteBanner = (item) => {
    showConfirm({
      title: "Delete Banner",
      content: "Are you sure you want to delete banner?",
      onOk: async () => {
        // let data = {
        //   orderId: item?.orderId,
        // };
        try {
          let res = await apiObj.deleteBanner(item?.id, headers);
          notifySuccess(res?.data?.message);
          getBanners();
        } catch (err) {
          console.log(err);
        }
        // call your delete API here
      },
      onCancel: () => {
        console.log("Delete cancelled");
      },
    });
  };
  useEffect(() => {
    getBanners();
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
          <div className="flex justify-end">
            <Button onClick={() => setState({ open: true })}>Add New</Button>
          </div>

          <div>
            <DynamicTable columns={bannerColumns} dataSource={dataSource} />
          </div>
        </div>

        {state?.open && (
          <DynamicModal
            open={state?.open}
            title={state?.record ? "Update banner" : "Add banner"}
            onCancel={closeModal}
            footer={false}
          >
            <Formik
              initialValues={{
                bannerTitle: state?.record?.title || "",
                bannerImage: state?.record?.bannerImage || "",
              }}
              validationSchema={BannerSchema}
              onSubmit={addBanner}
            >
              {({ setFieldValue, errors }) => (
                <Form>
                  <div style={{ marginBottom: "15px" }}>
                    <TextInput label="Banner Title" name="bannerTitle" />
                  </div>
                  {console.log(errors)}

                  <ImgUpload
                    label="Banner Image"
                    name="bannerImage"
                    setFieldValue={setFieldValue}
                    error={errors?.bannerImage}
                    value={state?.record?.bannerImage}
                  />
                  <div className="pt-3">
                    <Button htmlType="submit" className="w-full mt-3">
                      Submit
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </DynamicModal>
        )}
      </Layout>
    </div>
  );
};

export default Homebanners;
