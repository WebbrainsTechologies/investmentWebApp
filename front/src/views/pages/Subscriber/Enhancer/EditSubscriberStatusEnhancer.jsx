import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    usersubscriptionstatus: Yup.string().required("Please select status"),
    remark: Yup.string().when("usersubscriptionstatus", {
      is: status => status === "Rejected",
      then: () => Yup.string().required("Please enter remark"),
      otherwise: () => Yup.string()
    })
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    usersubscriptionstatus: "",
    subcription_file: "",
    notificationId: "",
    userId: "",
    remark: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
