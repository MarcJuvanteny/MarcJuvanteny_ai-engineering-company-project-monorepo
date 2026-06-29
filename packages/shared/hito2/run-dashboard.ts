import { demoCarriers, demoProducts, demoShipment } from "./demo-data";
import { filterLowStockProducts } from "./utils/collections";
import {
  calculateTotalInventoryValue,
  countProductsByCategory,
  selectBestCarrier,
} from "./utils/transformations";
import { validateCarrier, validateProduct, validateShipment } from "./utils/validations";

export type Hito2DashboardResult = {
  inventoryValueUSD: number;
  lowStockSkus: string[];
  categoryCount: Record<string, number>;
  recommendedCarrier: {
    name: string;
    score: number;
    costUSD: number;
  } | null;
  validationSummary: {
    productsValid: boolean;
    shipmentValid: boolean;
    carriersValid: boolean;
  };
};

export function getHito2DashboardResult(): Hito2DashboardResult {
  const inventoryValueUSD = calculateTotalInventoryValue(demoProducts);
  const lowStockSkus = filterLowStockProducts(demoProducts).map((item) => item.sku);
  const categoryCount = countProductsByCategory(demoProducts);

  const selectedProduct = demoProducts.find((p) => p.sku === demoShipment.sku) || demoProducts[0];
  const bestCarrier = selectBestCarrier(demoCarriers, demoShipment, selectedProduct);

  const productsValid = demoProducts.every((product) => validateProduct(product).valid);
  const shipmentValid = validateShipment(demoShipment).valid;
  const carriersValid = demoCarriers.every((carrier) => validateCarrier(carrier).valid);

  return {
    inventoryValueUSD,
    lowStockSkus,
    categoryCount,
    recommendedCarrier: bestCarrier
      ? {
          name: bestCarrier.carrier.name,
          score: bestCarrier.score,
          costUSD: bestCarrier.cost,
        }
      : null,
    validationSummary: {
      productsValid,
      shipmentValid,
      carriersValid,
    },
  };
}
