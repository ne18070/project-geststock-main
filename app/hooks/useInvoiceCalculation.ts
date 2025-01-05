'use client';

export function useInvoiceCalculation() {
  const calculateTotals = (products: any[]) => {
    const subtotal = products.reduce(
      (acc, product) => acc + product.quantity * product.unitPrice,
      0,
    );

    const discount = products.reduce(
      (acc, product) => acc + (product.discount || 0),
      0,
    );

    const total = subtotal - discount;

    return {
      subtotal,
      discount,
      total,
    };
  };

  return {
    calculateTotals,
  };
}
