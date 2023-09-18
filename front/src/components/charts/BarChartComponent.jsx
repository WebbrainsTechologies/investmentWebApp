import React from "react";
import { Bar } from "react-chartjs-2";
import chroma from "chroma-js";

const BarChartComponent = ({ sidebarTheme, apidata }) => {
  // eslint-disable-next-line
  const color = chroma("#FF9224");

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    datasets: [
      {
        label: "Data",
        backgroundColor: "#FF9224",
        borderColor: "#FF9224",
        borderWidth: 1,
        hoverBackgroundColor: "#FF9224",
        hoverBorderColor: "#FF9224",
        data: apidata
      }
    ]
  };

  return (
    <div>
      <p className="chart-title">Investment chart</p>
      <Bar
        data={data}
        width={100}
        height={300}
        options={{
          maintainAspectRatio: false
        }}
      />
    </div>
  );
};

export default BarChartComponent;
