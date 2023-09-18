import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    bank_user_name: Yup.string().required("Please Enter Name"),
    bank_phone_number: Yup.string()
      .matches(/^\d+$/, "Please Enter valid Phone Number")
      .length(10, "Please Enter valid phone number")
      .required("Please Enter Phone Number"),
    bank_pan_number: Yup.string().required("Please enter your pan number"),
    bank_account_number: Yup.string().required(
      "Please enter your account number"
    ),
    bank_account_name: Yup.string().required("Please enter your account name"),
    bank_ifsc_code: Yup.string().required("Please enter ifsc code"),
    country_code: Yup.string()
      .required("Please enter country code")
      .typeError(null),
    is_bank_verified: Yup.boolean()
  }),
  mapPropsToValues: props => ({
    bank_user_name: "",
    bank_phone_number: "",
    bank_pan_number: "",
    bank_account_number: "",
    bank_account_name: "",
    is_bank_verified: false,
    country_code: "",
    bank_ifsc_code: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
