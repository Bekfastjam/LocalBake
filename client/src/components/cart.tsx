
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { Business } from '@shared/schema';

export default function Cart() {
  const { state, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    specialInstructions: ''
  });

  const { data: business } = useQuery<Business>({
    queryKey: ['/api/businesses', state.businessId],
    queryFn: () => fetch(`/api/businesses/${state.businessId}`).then(res => res.json()),
    enabled: !!state.businessId
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error('Failed to create order');
      return response.json();
    },
    onSuccess: () => {
      clearCart();
      setIsCheckoutOpen(false);
      setCustomerInfo({ name: '', email: '', phone: '', specialInstructions: '' });
      alert('Order placed successfully!');
    }
  });

  const handleCheckout = () => {
    if (!customerInfo.name || !customerInfo.email) {
      alert('Please fill in name and email');
      return;
    }

    const orderItems = state.items.map(item => ({
      menuItemId: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    const orderData = {
      order: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        businessId: state.businessId,
        totalAmount: getCartTotal().toFixed(2),
        specialInstructions: customerInfo.specialInstructions
      },
      items: orderItems
    };

    createOrderMutation.mutate(orderData);
  };

  if (state.items.length === 0) {
    return (
      <div className="fixed right-4 top-24 bg-white rounded-lg shadow-lg border p-4 w-80">
        <h3 className="font-semibold text-lg mb-2">Your Cart</h3>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed right-4 top-24 bg-white rounded-lg shadow-lg border p-4 w-80 max-h-96 overflow-y-auto z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Your Cart</h3>
          <button onClick={clearCart} className="text-red-500 text-sm">Clear</button>
        </div>
        
        {business && (
          <p className="text-sm text-gray-600 mb-3">From: {business.name}</p>
        )}

        <div className="space-y-3">
          {state.items.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-green-600 font-semibold">${item.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm"
                >
                  -
                </button>
                <span className="text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 ml-2"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center font-semibold">
            <span>Total: ${getCartTotal().toFixed(2)}</span>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full mt-3 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>

      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Checkout</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Special Instructions</label>
                <textarea
                  value={customerInfo.specialInstructions}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={createOrderMutation.isPending}
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50"
              >
                {createOrderMutation.isPending ? 'Placing...' : `Place Order ($${getCartTotal().toFixed(2)})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
