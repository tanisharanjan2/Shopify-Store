import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TopCustomersBarChart({ data }) {
  const chartData = data.map(customer => ({
    name: customer.name || 'Unknown',
    'Total Spent': parseFloat(customer.spend ?? customer.totalSpent ?? 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tickFormatter={(value) => `₹${value}`} />
        <YAxis type="category" dataKey="name" width={120} />
        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
        <Legend />
        <Bar dataKey="Total Spent" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
