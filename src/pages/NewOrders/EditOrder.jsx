// components/EditOrderF.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input, Button } from "antd";
import * as Yup from "yup";
import apiObj from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  weight: Yup.number().required("Weight is required"),
  height: Yup.number().required("Height is required"),
  length: Yup.number().required("Length is required"),
  breadth: Yup.number().required("Breadth is required"),
});

const EditOrder = ({ record, onClose, refetch }) => {
  const navigate = useNavigate();
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);
  let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
  UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
  let headers = {
    Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
  };
  const initialValues = {
    weight: record?.weight || "",
    height: record?.height || "",
    length: record?.length || "",
    breadth: record?.breadth || "",
  };
  const editOrderFunc = async (values) => {
    let data = {
        height : +values?.height,
        weight:+values?.weight,
        breadth : +values?.breadth,
        length :+values?.length
    }
    try {
      let result = await apiObj.editOrder(record._id, data, headers);
      console.log(result);
      notifySuccess(result?.data?.message);
      onClose()
      //   getOrders();
    } catch (err) {
      if (
        err.response &&
        err.response.data.error == " Request is not authorized"
      ) {
        notifyError("Please Login Again");
        localStorage.removeItem("UNIKARIADMIN");
        navigate("/");
      }
      console.log(err);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={editOrderFunc}
      enableReinitialize
    >
      {({ isValid, isSubmitting }) => (
        <Form className=" gap-4">
          {["weight", "height", "length", "breadth"].map((field) => (
            <div key={field} className="pt-2">
              {console.log(field)}
              <label className="block mb-1 capitalize">
                {field} ({field == "weight" ? "kg" : "cm"})
              </label>
              <Field name={field}>
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder={`Enter ${field?.name}`}
                    type={"number"}
                  />
                )}
              </Field>
              <ErrorMessage
                name={field}
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
          ))}

          <div className="col-span-2 text-center mt-6">
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isValid || isSubmitting}
            >
              Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditOrder;
