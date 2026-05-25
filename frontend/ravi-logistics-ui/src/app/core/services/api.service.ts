import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Customer, Warehouse, Item, Asn, AsnLine,
  Inventory, Order, OrderLine, Wave,
  PickTask, PackTask, PackBox, Shipment, Carrier
} from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ─── Customers ──────────────────────────────────────────
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.api}/customers`);
  }
  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.api}/customers/${id}`);
  }
  createCustomer(customer: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(`${this.api}/customers`, customer);
  }
  updateCustomer(id: number, customer: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.api}/customers/${id}`, customer);
  }

  // ─── Warehouses ──────────────────────────────────────────
  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.api}/warehouses`);
  }

  // ─── Items ───────────────────────────────────────────────
  getItems(customerId?: number, search?: string): Observable<Item[]> {
    let params = new HttpParams();
    if (customerId) params = params.set('customerId', customerId);
    if (search) params = params.set('search', search);
    return this.http.get<Item[]>(`${this.api}/items`, { params });
  }
  getItem(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.api}/items/${id}`);
  }
  createItem(item: Partial<Item>): Observable<Item> {
    return this.http.post<Item>(`${this.api}/items`, item);
  }
  updateItem(id: number, item: Partial<Item>): Observable<Item> {
    return this.http.put<Item>(`${this.api}/items/${id}`, item);
  }
  deleteItem(id: number): Observable<unknown> {
    return this.http.delete(`${this.api}/items/${id}`);
  }

  // ─── ASN ─────────────────────────────────────────────────
  getAsns(customerId?: number): Observable<Asn[]> {
    let params = new HttpParams();
    if (customerId) params = params.set('customerId', customerId);
    return this.http.get<Asn[]>(`${this.api}/asns`, { params });
  }
  getAsn(id: number): Observable<Asn> {
    return this.http.get<Asn>(`${this.api}/asns/${id}`);
  }
  createAsn(asn: Partial<Asn>): Observable<Asn> {
    return this.http.post<Asn>(`${this.api}/asns`, asn);
  }
  updateAsnStatus(id: number, status: string): Observable<Asn> {
    return this.http.put<Asn>(`${this.api}/asns/${id}/status`, { status });
  }
  receiveAsnLine(asnLineId: number, qty: number, locationId: number): Observable<unknown> {
    return this.http.post(`${this.api}/asns/${asnLineId}/receive`, { qty, locationId });
  }
  getReceipts(asnId?: number): Observable<unknown[]> {
    let params = new HttpParams();
    if (asnId) params = params.set('asnId', asnId);
    return this.http.get<unknown[]>(`${this.api}/receipts`, { params });
  }

  // ─── Inventory ───────────────────────────────────────────
  getInventory(customerId?: number, itemId?: number): Observable<Inventory[]> {
    let params = new HttpParams();
    if (customerId) params = params.set('customerId', customerId);
    if (itemId) params = params.set('itemId', itemId);
    return this.http.get<Inventory[]>(`${this.api}/inventory`, { params });
  }
  checkAvailableQty(itemId: number, customerId: number): Observable<{ availableQty: number }> {
    const params = new HttpParams().set('itemId', itemId).set('customerId', customerId);
    return this.http.get<{ availableQty: number }>(`${this.api}/inventory/available`, { params });
  }
  receiveInventory(data: object): Observable<Inventory> {
    return this.http.post<Inventory>(`${this.api}/inventory/receive`, data);
  }
  adjustInventory(data: object): Observable<Inventory> {
    return this.http.post<Inventory>(`${this.api}/inventory/adjust`, data);
  }
  getInventoryTransactions(inventoryId: number): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${this.api}/inventory/${inventoryId}/transactions`);
  }

  // ─── Orders ──────────────────────────────────────────────
  getOrders(customerId?: number, status?: string): Observable<Order[]> {
    let params = new HttpParams();
    if (customerId) params = params.set('customerId', customerId);
    if (status) params = params.set('status', status);
    return this.http.get<Order[]>(`${this.api}/orders`, { params });
  }
  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.api}/orders/${id}`);
  }
  createOrder(order: Partial<Order> & { lines: Partial<OrderLine>[] }): Observable<Order> {
    return this.http.post<Order>(`${this.api}/orders`, order);
  }
  allocateOrder(id: number): Observable<Order> {
    return this.http.post<Order>(`${this.api}/orders/${id}/allocate`, {});
  }
  cancelOrder(id: number): Observable<Order> {
    return this.http.post<Order>(`${this.api}/orders/${id}/cancel`, {});
  }
  getOrderLines(orderId: number): Observable<OrderLine[]> {
    return this.http.get<OrderLine[]>(`${this.api}/orders/${orderId}/lines`);
  }

  // ─── Waves ───────────────────────────────────────────────
  getWaves(warehouseId?: number, status?: string): Observable<Wave[]> {
    let params = new HttpParams();
    if (warehouseId) params = params.set('warehouseId', warehouseId);
    if (status) params = params.set('status', status);
    return this.http.get<Wave[]>(`${this.api}/waves`, { params });
  }
  getWave(id: number): Observable<Wave> {
    return this.http.get<Wave>(`${this.api}/waves/${id}`);
  }
  createWave(data: { warehouseId: number; orderIds: number[]; createdBy?: string }): Observable<Wave> {
    return this.http.post<Wave>(`${this.api}/waves`, data);
  }
  releaseWave(id: number): Observable<Wave> {
    return this.http.post<Wave>(`${this.api}/waves/${id}/release`, {});
  }
  completeWave(id: number): Observable<Wave> {
    return this.http.post<Wave>(`${this.api}/waves/${id}/complete`, {});
  }
  getWaveOrders(waveId: number): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${this.api}/waves/${waveId}/orders`);
  }

  // ─── Picks ───────────────────────────────────────────────
  getPickTasks(params: { waveId?: number; orderId?: number; pickerId?: string; status?: string }): Observable<PickTask[]> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => { if (v != null) httpParams = httpParams.set(k, String(v)); });
    return this.http.get<PickTask[]>(`${this.api}/picks`, { params: httpParams });
  }
  assignPickTask(id: number, pickerId: string): Observable<PickTask> {
    return this.http.post<PickTask>(`${this.api}/picks/${id}/assign`, { pickerId });
  }
  confirmPick(id: number, data: { confirmedQty: number; pickedBy: string; notes?: string }): Observable<PickTask> {
    return this.http.post<PickTask>(`${this.api}/picks/${id}/confirm`, data);
  }

  // ─── Packs ───────────────────────────────────────────────
  getPackTask(orderId: number): Observable<PackTask> {
    let params = new HttpParams().set('orderId', orderId);
    return this.http.get<PackTask>(`${this.api}/packs`, { params }).pipe() as Observable<PackTask>;
  }
  createPackTask(data: { orderId: number; warehouseId: number; stationCode?: string }): Observable<PackTask> {
    return this.http.post<PackTask>(`${this.api}/packs`, data);
  }
  startPackTask(id: number, packerId: string): Observable<PackTask> {
    return this.http.post<PackTask>(`${this.api}/packs/${id}/start`, { packerId });
  }
  addBox(data: { packTaskId: number; boxType: string; length?: number; width?: number; height?: number }): Observable<PackBox> {
    return this.http.post<PackBox>(`${this.api}/packs/${data.packTaskId}/boxes`, data);
  }
  completePackTask(id: number): Observable<PackTask> {
    return this.http.post<PackTask>(`${this.api}/packs/${id}/complete`, {});
  }
  getPackBoxes(packTaskId: number): Observable<PackBox[]> {
    return this.http.get<PackBox[]>(`${this.api}/packs/${packTaskId}/boxes`);
  }

  // ─── Shipments ───────────────────────────────────────────
  getShipments(status?: string): Observable<Shipment[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Shipment[]>(`${this.api}/shipments`, { params });
  }
  getShipment(id: number): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.api}/shipments/${id}`);
  }
  getShipmentByOrder(orderId: number): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.api}/shipments/order/${orderId}`);
  }
  createShipment(data: Partial<Shipment>): Observable<Shipment> {
    return this.http.post<Shipment>(`${this.api}/shipments`, data);
  }
  dispatchShipment(id: number, data: { shippedBy: string; shipDate: string; freightCost?: number }): Observable<Shipment> {
    return this.http.post<Shipment>(`${this.api}/shipments/${id}/dispatch`, data);
  }
  updateShipmentStatus(id: number, status: string): Observable<Shipment> {
    return this.http.put<Shipment>(`${this.api}/shipments/${id}/status`, { status });
  }
  getCarriers(): Observable<Carrier[]> {
    return this.http.get<Carrier[]>(`${this.api}/shipments/carriers`);
  }
}
