import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function ActivityPage() {
  const { eventSummary } = useOutletContext();

  return (
    <div className="widget">
      <h3>Activity</h3>
      {eventSummary && (
        <div>
          <div>Checkouts Started: {eventSummary.checkout_started || 0}</div>
          <div>Abandoned Carts: {eventSummary.cart_abandoned || 0}</div>
        </div>
      )}
    </div>
  );
}
