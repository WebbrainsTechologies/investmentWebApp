import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Please enter name"),
    onmeta_data: Yup.string().required("Please select currency")
    // multiply_value: Yup.number()
    //   .typeError("Must be a number")
    //   .nullable()
    //   .test("is-valid-number", "Invalid number", (value) =>
    //     /^\d+(\.\d+)?$/.test(String(value))
    //   )
    //   .required("Please enter multiply value"),
    // currency_logo: Yup.string().required("Please select currency logo"),
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    name: "",
    onmeta_data: ""
    // multiply_value: null,
    // currency_logo: "",
    // current_file: null,
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
