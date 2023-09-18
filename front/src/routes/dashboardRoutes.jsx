import { AdminDashboard, Dashboard } from "views/app/index";
import EditProfile from "views/pages/admin/EditProfile";
import ChangePassword from "views/pages/admin/ChangePassword";
import userlist from "views/pages/userList/userlist";
import subscriptionList from "views/pages/subscription/subscriptionList";
import currencyList from "views/pages/currency/currencyList";
import durationList from "views/pages/duration/durationList";
import Subscriptionview from "views/pages/SubscriptionUserView/Subscriptionview";
import subscriberList from "views/pages/Subscriber/subscriberList";
import PackageList from "views/pages/Packages/PackageList";
import UserTransectionList from "views/pages/Usertransaction/UsertransactionList";
import AdminTransactionList from "views/pages/Admintransaction/AdmintransactionList";
import UserWithdrawalList from "views/pages/Userwithdrawal/UserWithdrawalList";
import AdminWithdrawalList from "views/pages/Adminwithdrawal/AdminWithdrawalList";
import UserDetails from "views/pages/userList/UserDetails";
import UserKyc from "views/pages/Userkyc/Userkyc";
import AdminkycList from "views/pages/Adminkyc/AdminkycList";
import AdminkycEdit from "views/pages/Adminkyc/AdminkycEdit ";
import Paymentpage from "views/pages/SubscriptionUserView/Paymentpage";
import DynemicWithdrawal from "views/pages/Withdrawal/DynemicWithdrawal";
import ChoosePaymentMethod from "views/pages/SubscriptionUserView/ChoosePaymentMethod";
import ManualPaymentPage from "views/pages/SubscriptionUserView/ManualPaymentPage";
import ChooseWithdrawalMethod from "views/pages/Withdrawal/ChooseWithdrawalMethod";
import ManualWithdrawal from "views/pages/Withdrawal/ManualWithdrawal";
import WalletWithdrawalRequests from "views/pages/WalletWithdrawal/WalletWithdrawalRequests";
import CommisionPayout from "views/pages/Usertransaction/CommisionPayout";
import LinkBankAccount from "views/pages/Linkbankaccount/LinkBankAccount";
import ChooseBankAccount from "views/pages/Withdrawal/ChooseBankAccount";
import Myteam from "views/pages/Myteam/Myteam";
import Invoice from "views/pages/Invoice/Invoice";
import DeletedUserList from "views/pages/Deleteduserlist/DeletedUserList";
import UserInvoiceList from "views/pages/Invoice/UserInvoiceList";

const dashboardRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/admindashboard", component: AdminDashboard },
  { path: "/users", component: userlist },
  { path: "/subscription", component: subscriptionList },
  { path: "/subscriptionplan", component: Subscriptionview },
  { path: "/subscriber", component: subscriberList },
  { path: "/packages", component: PackageList },
  { path: "/usertransaction", component: UserTransectionList },
  { path: "/transaction", component: AdminTransactionList },
  { path: "/withdrawal", component: UserWithdrawalList },
  { path: "/withdrawalrequests", component: AdminWithdrawalList },
  { path: "/currency", component: currencyList },
  { path: "/duration", component: durationList },
  { path: "/change-password", component: ChangePassword },
  { path: "/profile", component: EditProfile },
  { path: "/userdetail/:id", component: UserDetails },
  { path: "/userkyc", component: UserKyc },
  { path: "/kycList", component: AdminkycList },
  { path: "/kycdetail/:id", component: AdminkycEdit },
  { path: "/paymentpage/:id", component: Paymentpage },
  { path: "/withdrawalscreen/:id", component: DynemicWithdrawal },
  { path: "/walletWithdraw", component: WalletWithdrawalRequests },
  { path: "/linkbankaccount", component: LinkBankAccount },
  { path: "/choosebankaccount/:id", component: ChooseBankAccount },
  { path: "/myteam", component: Myteam },
  { path: "/invoice", component: Invoice },
  { path: "/userinvoice", component: UserInvoiceList },
  { path: "/deletedusers", component: DeletedUserList },

  //new route
  { path: "/choosePaymentMethod/:id", component: ChoosePaymentMethod },
  { path: "/manuallpaymentpage/:id", component: ManualPaymentPage },
  { path: "/choose-withdrawal-method/:id", component: ChooseWithdrawalMethod },
  { path: "/manual-withdrawal/:id", component: ManualWithdrawal },
  { path: "/commision-payout", component: CommisionPayout }
];
export default dashboardRoutes;
