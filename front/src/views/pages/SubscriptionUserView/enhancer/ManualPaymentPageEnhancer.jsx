import * as Yup from "yup";
import { withFormik } from "formik";

const ManualPaymentEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    quantity: Yup.string()
      .required("Please enter quantity")
      .test("is-valid-number", "Invalid number", value =>
        /^[1-9]\d*$/.test(String(value))
      ),
    terms_condition: Yup.boolean().oneOf(
      [true],
      "Please check terms and privacy policy"
    ),
    other_terms_condition: Yup.boolean().oneOf(
      [true],
      "Please check terms and condition"
    ),
    minimum_value: Yup.string().required("Please enter minimum value"),
    amount: Yup.string().test(
      "IsvalidAmount",
      "Please buy the minimum amount",
      function(value) {
        if (value) {
          const minimumValue = parseFloat(
            this.resolve(Yup.ref("minimum_value"))
          );
          // console.log(minimumValue, "checkvalues");
          return parseFloat(value) >= parseFloat(minimumValue);
        }
      }
    )
  }),
  // validateOnMount: true,
  mapPropsToValues: props => ({
    quantity: "1",
    terms_condition: false,
    other_terms_condition: false,
    minimum_value: "",
    amount: "",
    inr_amount: "",
    utr_value: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default ManualPaymentEnhancer;
