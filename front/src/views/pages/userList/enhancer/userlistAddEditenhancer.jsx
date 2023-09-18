import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .matches(/^[a-zA-Z][a-zA-Z ]*$/, "Please enter valid name")
      .required("Please enter name"),
    email: Yup.string()
      .email("Please enter valid email")
      .required("Please enter email"),
    country_code: Yup.string().required("Please select country code"),
    phone_number: Yup.string()
      .required("Please enter phone number")
      .min(10, "please enter valid number")
      .max(10, "Please enter valid number")
      .matches(/^\d+$/, "Please enter valid number"),
    is_delete: Yup.boolean().required("Please select user status")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    name: "",
    email: "",
    country_code: "",
    phone_number: "",
    is_delete: true
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
