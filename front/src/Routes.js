import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import { compose } from "redux";
import authActions from "redux/auth/actions";
import { history } from "./redux/store";
// import CardLoader from "components/common/CardLoader";
// import { checkApi } from "services/loginServices";
// Layout Routes
import layoutRoutes from "./routes/index.jsx";
import navigationAction from "redux/navigation/actions";
import scrumAction from "redux/scrumboard/actions";
import { checkApi } from "services/authServices";
// import { setSourceMapRange } from "typescript";
// import { checkApi } from "services/loginServices";

const { check, logout, setUser } = authActions;
const { success, error, getNotificationData } = navigationAction;

const Routes = props => {
  const {
    token,
    check,
    user,
    // logout,
    // success,
    // fetching,
    // error,
    user_id,
    getNotificationData
    // getSubjectData,
    // getStatusData
    // toggleSubscriptionLoader
  } = props;

  const location = useLocation();

  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(true);
  var excludePath = [
    "login",
    "register",
    "forgotPassword",
    "admin",
    "user",
    "request-accept",
    "login_as"
  ];

  const checkLogin = async () => {
    const data = { id: user_id, token: token };
    await checkApi(token, data).then(data => {
      if (data.success) {
        check(data.data);
        // console.log(data.data, "checkdata");
        setUser(data.data);
        // toggleSubscriptionLoader(false);
        success();
      } else {
        logout(token);
        error();
      }
    });
  };
  // const handleLogout = () => {
  //   logout(token);
  // };
  // useEffect(() => {
  //   window.addEventListener("beforeunload", handleLogout);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleLogout);
  //   };
  // }, []);
  useEffect(() => {
    // console.log(location.pathname, "location.path");
    if (!excludePath.includes(location.pathname.split("/")[1])) {
      checkLogin();
      getNotificationData(token);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  return (
    //    isLoading ? (
    //     <CardLoader />
    //   ) : (
    //   <Router history={history}>
    <Switch>
      <Route
        exact
        path="/"
        render={() =>
          token ? (
            user?.is_superadmin ? (
              <Redirect to="/admindashboard" />
            ) : (
              <Redirect to="/dashboard" />
            )
          ) : (
            <Redirect to="/login" />
          )
        }
      />
      {layoutRoutes.map((prop, key) => {
        return (
          <Route
            path={prop.path}
            component={prop.component}
            key={key}
            history={history}
          />
        );
      })}
    </Switch>
    // </Router>
  );
};

const mapStateToProps = state => {
  // console.log(state.auth.user, "check107");
  return {
    token: state.auth.accessToken,
    user: state.auth.user,
    user_id: state.auth.user_id
  };
};

export default compose(
  connect(mapStateToProps, {
    check,
    logout,
    success,
    error,
    getNotificationData,
    setUser
  })
)(Routes);
