import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    status: Yup.string()
      .required("Please select the status")
      .notOneOf(["Pending"], "Please select Status"),
    comment: Yup.string().when("status", {
      is: status => status && status === "Reject",
      then: () => Yup.string().required("Please enter comment"),
      otherwise: () => Yup.string()
    }),
    rejected_section: Yup.array().when("status", {
      is: status => status && status === "Reject",
      then: () => Yup.array().min(1, "Please select rejected section"),
      otherwise: () => Yup.array()
    })
  }),
  mapPropsToValues: props => ({
    status: "",
    comment: "",
    rejected_section: []
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
