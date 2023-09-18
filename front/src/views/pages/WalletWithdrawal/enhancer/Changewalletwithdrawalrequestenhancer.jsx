import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    status: Yup.string().required("Please select status"),
    withdrawal_file: Yup.string().when("status", {
      is: status => status && status === "Accepted",
      then: () => Yup.string().required("Please select file"),
      otherwise: () => Yup.string()
    }),
    remark: Yup.string().when("status", {
      is: status => status && status === "Rejected",
      then: () => Yup.string().required("Please enter remark"),
      otherwise: () => Yup.string()
    })
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    status: "",
    withdrawal_file: "",
    remark: "",
    current_file: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
