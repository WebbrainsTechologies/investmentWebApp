import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    otpCheck: Yup.string()
      .required("Please enter otp")
      .min(4, "Please enter valid otp")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    otpCheck: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
