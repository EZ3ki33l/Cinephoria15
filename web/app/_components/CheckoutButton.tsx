'use client';

import { getStripe } from '@/app/config/stripe';
import { Button } from '@/app/_components/_layout/button';

interface CheckoutButtonProps {
  items: {
    price: string;
    quantity: number;
    showtime: number;
    seats: string[];
    unitPrice: number;
  }[];
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({ items }) => {
  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error in handleCheckout:', error);
    }
  };

  return (
    <Button onClick={handleCheckout} variant="secondary">
      Payer
    </Button>
  );
}; 