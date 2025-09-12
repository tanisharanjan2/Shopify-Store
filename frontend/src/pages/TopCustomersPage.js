import React from 'react';
import { useOutletContext } from 'react-router-dom';
import TopCustomersBarChart from '../components/TopCustomersBarChart';

export default function TopCustomersPage() {
  const { topCustomersChartData } = useOutletContext();

  return (
    <div className="widget">
      <h3>Top 5 Customers by Spend</h3>
      <TopCustomersBarChart data={topCustomersChartData} />
    </div>
  );
}
