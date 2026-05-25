package com.ravilogistics.item.service;

import com.ravilogistics.item.dto.ItemDTO;
import com.ravilogistics.item.entity.Customer;
import com.ravilogistics.item.entity.Item;
import com.ravilogistics.item.entity.Warehouse;
import com.ravilogistics.item.repository.CustomerRepository;
import com.ravilogistics.item.repository.ItemRepository;
import com.ravilogistics.item.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final CustomerRepository customerRepository;
    private final WarehouseRepository warehouseRepository;

    public List<Item> getAllItems(Long customerId) {
        if (customerId != null) return itemRepository.findByCustomerIdAndIsActiveTrue(customerId);
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
    }

    public List<Item> searchItems(Long customerId, String search) {
        return itemRepository.searchItems(customerId, search);
    }

    @Transactional
    public Item createItem(ItemDTO dto) {
        if (!customerRepository.existsById(dto.getCustomerId())) {
            throw new RuntimeException("Customer not found: " + dto.getCustomerId());
        }
        if (itemRepository.existsByCustomerIdAndItemCode(dto.getCustomerId(), dto.getItemCode())) {
            throw new RuntimeException("Item code already exists for this customer: " + dto.getItemCode());
        }
        Item item = new Item();
        BeanUtils.copyProperties(dto, item, "itemId");
        return itemRepository.save(item);
    }

    @Transactional
    public Item updateItem(Long id, ItemDTO dto) {
        Item existing = getItemById(id);
        BeanUtils.copyProperties(dto, existing, "itemId", "customerId", "createdAt");
        return itemRepository.save(existing);
    }

    @Transactional
    public void deleteItem(Long id) {
        Item item = getItemById(id);
        item.setIsActive(false);
        itemRepository.save(item);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findByIsActiveTrue();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found: " + id));
    }

    @Transactional
    public Customer createCustomer(Customer customer) {
        if (customerRepository.existsByCustomerCode(customer.getCustomerCode())) {
            throw new RuntimeException("Customer code already exists: " + customer.getCustomerCode());
        }
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer updateCustomer(Long id, Customer customer) {
        Customer existing = getCustomerById(id);
        customer.setCustomerId(id);
        customer.setCreatedAt(existing.getCreatedAt());
        return customerRepository.save(customer);
    }

    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findByIsActiveTrue();
    }

    @Transactional
    public Warehouse createWarehouse(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }
}
