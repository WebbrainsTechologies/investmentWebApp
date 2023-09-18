import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Please package enter name"),
    currency: Yup.string().required("Please select currency"),
    amount: Yup.string()
      .test("is-valid-number", "Invalid number", value =>
        /^\d+(\.\d+)?$/.test(String(value))
      )
      .required("Please enter amount"),
    // multiply_value: Yup.string()
    //   .test("is-valid-number", "Invalid number", value =>
    //     /^\d+(\.\d+)?$/.test(String(value))
    //   )
    //   .required("Please enter multiply value"),
    duration: Yup.string().required("Please select duration"),
    roi_duration: Yup.string()
      .required("Please select roi duration")
      .test(
        "is-valid-roi-duration",
        "Invalid roi duration",
        (value, context) => {
          let duration = parseFloat(context.parent.duration);
          let valueInMonths;
          if (value === "monthly") {
            valueInMonths = 1;
          } else if (value === "daily") {
            valueInMonths = 1;
          } else if (value === "quarterly") {
            valueInMonths = 3;
          } else if (value === "halfyearly") {
            valueInMonths = 6;
          } else if (value === "yearly") {
            valueInMonths = 12;
          } else if (value === "one and half year") {
            valueInMonths = 18;
          } else if (value === "two year") {
            valueInMonths = 24;
          } else if (value === "two and half year") {
            valueInMonths = 30;
          } else if (value === "three year") {
            valueInMonths = 36;
          } else if (value === "three and half year") {
            valueInMonths = 42;
          } else if (value === "four year") {
            valueInMonths = 48;
          } else if (value === "four and half year") {
            valueInMonths = 54;
          } else if (value === "five year") {
            valueInMonths = 60;
          }
          let result = duration % valueInMonths === 0 ? true : false;
          return result;
        }
      ),
    roi: Yup.string()
      .test("is-valid-number", "Invalid number", value =>
        /^\d+(\.\d+)?$/.test(String(value))
      )
      .required("Please enter roi"),
    principal_withdrawal: Yup.string()
      .test("is-valid-number", "Invalid number", value =>
        /^\d+(\.\d+)?$/.test(String(value))
      )
      .required("Please enter principal withdrawal"),
    commision_method: Yup.string().required("Please select commision method"),
    commision: Yup.string()
      .test("is-valid-number", "Invalid number", value =>
        /^\d+(\.\d+)?$/.test(String(value))
      )
      .required("Please enter commision"),
    minimum_value: Yup.string()
      .test(
        "greaterThanOrEqualAmount",
        "Minimum value must be greater than or equal to amount",
        function(value) {
          const amount = parseFloat(this.resolve(Yup.ref("amount")));
          const minimumValue = parseFloat(value);
          return minimumValue >= amount;
        }
      )
      .required("Please enter minimum value")
      .test("is-valid-number", "Invalid number", value =>
        /^[1-9]\d*$/.test(String(value))
      ),
    description: Yup.string().nullable(),
    maximum_value: Yup.string().test(
      "greaterThanAmount",
      "Maximum value must be greater than amount",
      function(value) {
        if (value) {
          const amount = this.resolve(Yup.ref("amount"));
          return parseFloat(value) > parseFloat(amount);
        } else {
          return true;
        }
      }
    ),
    status: Yup.boolean().required("Please select Status")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    name: "",
    currency: "",
    amount: "",
    // multiply_value: "",
    duration: "",
    roi: "",
    roi_duration: "",
    principal_withdrawal: "",
    commision_method: "one time",
    commision: "",
    description: "",
    maximum_value: "",
    minimum_value: "",
    status: true
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
