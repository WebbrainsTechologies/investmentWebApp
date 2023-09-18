import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    withdrawal_status: Yup.string().required("Please select status"),
    withdrawal_remark: Yup.string()
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    withdrawal_status: "",
    name: "",
    notificationId: "",
    userId: "",
    withdrawal_remark: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
