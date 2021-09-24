/** @format */

import React from "react";
import { connect } from "react-redux";

const Alert = ({ alerts }) => {
  if (alerts.length > 0) {
    console.log(alerts);
    return alerts.map((alert) => {
      return (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
          <h1>Error</h1>
        </div>
      );
    });
  } else if (alerts.length === 0) {
    console.log("part 2");
    return null;
  } else {
    console.log("part 3");
    return null;
  }
};

const mapStateToProps = (state) => ({
  alerts: state.AlertReducer,
});

export default connect(mapStateToProps)(Alert);
