import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    firstName: Yup.string()
      .required("Please enter first name")
      .matches(/^[a-zA-Z][a-zA-Z ]*$/, "Please enter valid first name"),
    lastName: Yup.string()
      .required("Please enter last name")
      .matches(/^[a-zA-Z][a-zA-Z ]*$/, "Please enter valid last name"),
    middleName: Yup.string().matches(
      /^[a-zA-Z][a-zA-Z ]*$/,
      "Please enter valid middle name"
    ),
    dateOfBirth: Yup.string().required("Please select date of birth"),
    gender: Yup.string().required("Please select gender")
    // aadhar_number: Yup.string().required("Please enter aadhar number"),
    // pan_number: Yup.string().required("Please enter pan number")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    step: 1
    // aadhar_number: "",
    // pan_number: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
