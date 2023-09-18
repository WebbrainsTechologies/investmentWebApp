import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    current_password: Yup.string().required("Please Enter Current Password"),
    new_password: Yup.string()
      .min(8, "The password must be 8 to 16 characters in length.")
      .max(16, "The password must be 8 to 16 characters in length")
      .trim()
      .required("Please Enter New Password"),
    confirm_new_password: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Passwords must match")
      .required("Please Enter Confirm Password")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    current_password: "",
    new_password: "",
    confirm_new_password: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
