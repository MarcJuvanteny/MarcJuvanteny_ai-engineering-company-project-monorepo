import { Carrier, Product, Shipment } from "../types/models";

export function validateProduct(product: Product): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!product.sku || product.sku.trim() === "") {
    errors.push("El SKU no puede estar vacio");
  }

  if (product.weightKg <= 0 || product.weightKg > 100) {
    errors.push("El peso debe ser mayor que 0 y menor o igual a 100 kg");
  }

  if (product.stockQuantity < 0) {
    errors.push("La cantidad en stock no puede ser negativa");
  }

  if (product.minStockThreshold < 0) {
    errors.push("El umbral minimo de stock no puede ser negativo");
  }

  if (product.unitCostUSD <= 0) {
    errors.push("El precio unitario debe ser mayor que 0");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateShipment(shipment: Shipment): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (shipment.quantity <= 0) {
    errors.push("La cantidad debe ser mayor que 0");
  }

  if (shipment.declaredValueUSD <= 0) {
    errors.push("El valor declarado debe ser mayor que 0");
  }

  if (shipment.destination.distanceKm < 0) {
    errors.push("La distancia no puede ser negativa");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateCarrier(carrier: Carrier): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (carrier.baseRateUSD < 0) {
    errors.push("La tarifa base no puede ser negativa");
  }

  if (carrier.onTimeRate < 0 || carrier.onTimeRate > 100) {
    errors.push("La tasa de puntualidad debe estar entre 0 y 100");
  }

  if (carrier.maxWeightKg <= 0) {
    errors.push("El peso maximo debe ser mayor que 0");
  }

  if (carrier.operatesIn.length === 0) {
    errors.push("El transportista debe operar en al menos un pais");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
