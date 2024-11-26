import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

import "./ChartCss.css"


export default function SecondPieChart({data}) {
  
  const generateMixedColor = (index) => {
    return `hsl(${(index * 137.508) % 360}, 70%, 80%)`;
  };
  
  const colors=[
    'red','blue','green'
  ];

  const data2 = (Array.isArray(data) ? data : []).map((item, index) => ({
    label: item.name || item.label,
    value: item.value,
    color: colors[index] || generateMixedColor(index),
  }));

  console.log("Transformed data is:", data2);

  return (
    <PieChart
      series={[
        {
          data: data2,
          cx: 150,
          cy: 150,
          innerRadius: 40,
          outerRadius: 80,
          colorField: 'color', // Set color field to use colors from data
        },
      ]}
      height={300}
      slotProps={{
        legend: { hidden: false}
      }}
    />
  );
}
