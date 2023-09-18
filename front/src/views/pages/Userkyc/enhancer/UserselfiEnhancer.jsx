import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    front_image: Yup.string().required("Please select front image")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    front_image: "",
    front_image_currentFile: "",
    step: 4
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
