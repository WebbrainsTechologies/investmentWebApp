import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    month: Yup.string()
      .matches(/^\d+$/, "Please enter only whole digits")
      .required("Please enter month"),
    status: Yup.boolean().required("Please select Status")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    month: "",
    status: true
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
