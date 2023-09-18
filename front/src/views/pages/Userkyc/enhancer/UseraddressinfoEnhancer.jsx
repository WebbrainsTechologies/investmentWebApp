import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    address_line_one: Yup.string().required("Please enter address"),
    address_line_second: Yup.string(),
    address_line_third: Yup.string(),
    country: Yup.string().required("Please enter a country"),
    state: Yup.string().required("Please enter a state"),
    city: Yup.string().required("Please enter a city"),
    pincode: Yup.string().required("Please enter a pincode")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    address_line_one: "",
    address_line_second: "",
    address_line_third: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    step: 2
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
