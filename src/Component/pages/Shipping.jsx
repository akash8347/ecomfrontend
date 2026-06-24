import React from 'react';
import CheckoutFlow from './CheckoutFlow';

const Shipping = ({ step = 'address' }) => <CheckoutFlow step={step} />;

export default Shipping;