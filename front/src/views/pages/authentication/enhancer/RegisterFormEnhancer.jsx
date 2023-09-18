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
    password: Yup.string()
      .min(8, "The password must be 8 to 16 characters in length.")
      .max(16, "The password must be 8 to 16 characters in length")
      .trim()
      .required("Please enter password"),
    country_code: Yup.string().required("Please select country code"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please Enter Confirm Password"),
    phone_number: Yup.string()
      .required("Please enter phone number")
      .min(7, "please enter valid number")
      .max(20, "Please enter valid number")
      .matches(/^\d+$/, "Please enter valid number"),
    terms_condition: Yup.boolean().oneOf(
      [true],
      "Please check terms and condition"
    ),
    referral_code: Yup.string()
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    name: "",
    email: "",
    password: "",
    country_code: "",
    phone_number: "",
    confirm_password: "",
    referral_code: "",
    terms_condition: false
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
