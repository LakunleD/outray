export async function initiateCheckout(
  productId: string,
  organizationId: string,
  customerEmail: string,
  customerName: string,
): Promise<string> {
  const params = new URLSearchParams({
    products: productId,
    customerEmail,
    customerName,
    metadata: JSON.stringify({ organizationId }),
  });

  const checkoutUrl = `/api/checkout/polar?${params.toString()}`;

  return checkoutUrl;
}

export const POLAR_PRODUCT_IDS = {
  ray: process.env.POLAR_PRODUCT_RAY || "",
  beam: process.env.POLAR_PRODUCT_BEAM || "",
} as const;
