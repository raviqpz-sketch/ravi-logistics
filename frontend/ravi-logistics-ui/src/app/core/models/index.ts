export interface Customer {
  customerId: number;
  customerCode: string;
  customerName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isActive: boolean;
}

export interface Warehouse {
  warehouseId: number;
  warehouseCode: string;
  warehouseName: string;
  city: string;
  state: string;
  isActive: boolean;
}

export interface Item {
  itemId: number;
  customerId: number;
  itemCode: string;
  itemName: string;
  description: string;
  uom: string;
  unitWeight: number;
  unitCost: number;
  unitPrice: number;
  category: string;
  barcode: string;
  lotControlled: boolean;
  isActive: boolean;
}

export interface Asn {
  asnId: number;
  asnNumber: string;
  customerId: number;
  warehouseId: number;
  supplierName: string;
  supplierRef: string;
  expectedDate: string;
  status: string;
  notes: string;
  lines?: AsnLine[];
}

export interface AsnLine {
  asnLineId: number;
  asnId: number;
  lineNumber: number;
  itemId: number;
  expectedQty: number;
  receivedQty: number;
  status: string;
}

export interface Inventory {
  inventoryId: number;
  customerId: number;
  warehouseId: number;
  itemId: number;
  locationId: number;
  lotNumber: string;
  onHandQty: number;
  reservedQty: number;
  availableQty: number;
  uom: string;
}

export interface Order {
  orderId: number;
  orderNumber: string;
  customerId: number;
  warehouseId: number;
  orderDate: string;
  requiredShipDate: string;
  shipToName: string;
  shipToAddress1: string;
  shipToCity: string;
  shipToState: string;
  shipToZip: string;
  carrierId: number;
  serviceLevel: string;
  status: string;
  priority: number;
  notes: string;
  lines?: OrderLine[];
}

export interface OrderLine {
  orderLineId: number;
  orderId: number;
  lineNumber: number;
  itemId: number;
  orderedQty: number;
  allocatedQty: number;
  pickedQty: number;
  packedQty: number;
  shippedQty: number;
  status: string;
}

export interface Wave {
  waveId: number;
  waveNumber: string;
  warehouseId: number;
  waveDate: string;
  status: string;
  totalOrders: number;
  totalLines: number;
  totalUnits: number;
  createdBy: string;
  releasedAt: string;
  completedAt: string;
}

export interface PickTask {
  pickTaskId: number;
  waveId: number;
  orderId: number;
  orderLineId: number;
  itemId: number;
  pickLocationId: number;
  pickQty: number;
  confirmedQty: number;
  lotNumber: string;
  status: string;
  pickerId: string;
  assignedAt: string;
  completedAt: string;
}

export interface PackTask {
  packTaskId: number;
  orderId: number;
  warehouseId: number;
  stationCode: string;
  status: string;
  packerId: string;
  startedAt: string;
  completedAt: string;
  boxes?: PackBox[];
}

export interface PackBox {
  boxId: number;
  packTaskId: number;
  boxSequence: number;
  boxType: string;
  grossWeight: number;
  isClosed: boolean;
}

export interface Shipment {
  shipmentId: number;
  shipmentNumber: string;
  orderId: number;
  carrierId: number;
  carrierName: string;
  serviceLevel: string;
  trackingNumber: string;
  shipDate: string;
  estimatedDelivery: string;
  status: string;
  totalWeight: number;
  totalBoxes: number;
  freightCost: number;
}

export interface Carrier {
  carrierId: number;
  carrierCode: string;
  carrierName: string;
  serviceLevel: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
