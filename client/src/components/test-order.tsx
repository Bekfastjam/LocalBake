
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export default function TestOrder() {
  const [isTestMode, setIsTestMode] = useState(false);

  const testOrderMutation = useMutation({
    mutationFn: async () => {
      const testOrder = {
        order: {
          customerName: "Test Customer",
          customerEmail: "test@example.com",
          customerPhone: "555-0123",
          businessId: 1,
          totalAmount: 15.99,
          specialInstructions: "Test order - please ignore"
        },
        items: [
          {
            menuItemId: 1,
            quantity: 2,
            price: 7.99
          }
        ]
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testOrder)
      });

      if (!response.ok) {
        throw new Error('Test order failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      alert(`Test order #${data.id} created successfully!`);
    },
    onError: (error) => {
      alert(`Test order failed: ${error.message}`);
    }
  });

  if (!isTestMode) {
    return (
      <button
        onClick={() => setIsTestMode(true)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
      >
        Test Order System
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
      <h4 className="font-semibold mb-2">Test Order System</h4>
      <div className="space-y-2">
        <button
          onClick={() => testOrderMutation.mutate()}
          disabled={testOrderMutation.isPending}
          className="block w-full bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
        >
          {testOrderMutation.isPending ? 'Creating...' : 'Create Test Order'}
        </button>
        <button
          onClick={() => setIsTestMode(false)}
          className="block w-full bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
