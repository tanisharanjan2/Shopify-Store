import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function SalesTrendChart({ data }) {
  const chartData = data.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    Revenue: parseFloat(item.revenue),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(value) => `₹${value}`} />
        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
        <Legend />
        <Line type="monotone" dataKey="Revenue" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}