import { Carrier, Product, ProductCategory, Shipment } from "../types/models";

export function calculateShippingCost(
  shipment: Shipment,
  product: Product,
  carrier: Carrier
): number {
  const baseCost = carrier.baseRateUSD;
  const weightCost = product.weightKg * carrier.ratePerKgUSD * shipment.quantity;
  const distanceCost = shipment.destination.distanceKm * carrier.ratePerKmUSD;

  let subtotal = baseCost + weightCost + distanceCost;

  if (shipment.priority === "Express") {
    subtotal *= 1.3;
  } else if (shipment.priority === "Same-day") {
    subtotal *= 1.6;
  }

  return Math.round(subtotal * 100) / 100;
}

export function scoreCarrierForShipment(
  carrier: Carrier,
  shipment: Shipment,
  product: Product
): number {
  let score = 0;

  if (carrier.operatesIn.includes(shipment.destination.country)) {
    score += 20;
  }

  if (product.weightKg * shipment.quantity <= carrier.maxWeightKg) {
    score += 20;
  }

  if (carrier.acceptsPriority.includes(shipment.priority)) {
    score += 15;
  }

  if (product.isFragile) {
    if (carrier.handlesFragile) {
      score += 15;
    }
  } else {
    score += 15;
  }

  score += carrier.onTimeRate * 0.3;

  return Math.round(score * 100) / 100;
}

export function selectBestCarrier(
  carriers: Carrier[],
  shipment: Shipment,
  product: Product
): { carrier: Carrier; score: number; cost: number } | null {
  const scored = carriers.map((carrier) => ({
    carrier,
    score: scoreCarrierForShipment(carrier, shipment, product),
    cost: calculateShippingCost(shipment, product, carrier),
  }));

  const suitable = scored.filter((item) => item.score >= 50);
  if (suitable.length === 0) {
    return null;
  }

  return suitable.reduce((best, current) =>
    current.cost < best.cost ? current : best
  );
}

export function calculateTotalInventoryValue(products: Product[]): number {
  const total = products.reduce((sum, product) => {
    return sum + product.stockQuantity * product.unitCostUSD;
  }, 0);

  return Math.round(total * 100) / 100;
}

export function countProductsByCategory(
  products: Product[]
): Record<ProductCategory, number> {
  const result: Record<ProductCategory, number> = {
    Fashion: 0,
    Electronics: 0,
    Cosmetics: 0,
    Home: 0,
    Other: 0,
  };

  for (const product of products) {
    result[product.category]++;
  }

  return result;
}
