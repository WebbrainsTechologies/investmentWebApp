import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    document_type: Yup.string().required("Please select document type"),
    front_image: Yup.string().required("Please select front image"),
    back_image: Yup.string().required("Please select back image")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    document_type: "",
    front_image: "",
    front_image_currentFile: "",
    back_image: "",
    back_image_currentFile: "",
    stepc: 3
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
