import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Please Enter Name"),
    email: Yup.string()
      .email("Please enter valid email")
      .required("Please Enter Email"),
    country_code: Yup.string().required("Please select country code"),
    phone_number: Yup.string()
      .matches(/^\d+$/, "Please Enter valid Phone Number")
      .length(10, "Please Enter valid phone number")
      .required("Please Enter Phone Number"),
    gender: Yup.string(),
    address: Yup.string(),
    profile_img: Yup.string(),
    country: Yup.string()
  }),
  mapPropsToValues: props => ({
    name: "",
    email: "",
    country_code: "",
    phone_number: "",
    address: "",
    profile_img: "",
    gender: "",
    country: "",
    current_file: null
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
