import * as Yup from "yup";
import { withFormik } from "formik";

const ManualWithdrawalEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    network_type: Yup.string().required("Please enter network type"),
    walletAddress: Yup.string().required("Please enter wallet address"),
    walletAmount: Yup.number(),
    amount: Yup.number()
      .required("Please enter Withdraw amount")
      .test(
        "in-valid-withdraw",
        "You cannot withdraw more amount than  balance amount",
        (value, context) => {
          let walletAmount = context.parent.walletAmount;

          if (value > walletAmount) {
            return false;
          } else {
            return true;
          }
        }
      )
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    network_type: "",
    walletAddress: "",
    // walletAmount:20,
    walletAmount: "",
    amount: "",
    currencyId: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});
export default ManualWithdrawalEnhancer;
