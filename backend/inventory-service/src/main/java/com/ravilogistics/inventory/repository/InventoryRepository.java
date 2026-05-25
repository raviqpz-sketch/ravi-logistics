package com.ravilogistics.inventory.repository;

import com.ravilogistics.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findByCustomerId(Long customerId);

    List<Inventory> findByItemId(Long itemId);

    List<Inventory> findByCustomerIdAndItemId(Long customerId, Long itemId);

    Optional<Inventory> findByItemIdAndLocationIdAndLotNumber(Long itemId, Long locationId, String lotNumber);

    @Query("SELECT SUM(i.availableQty) FROM Inventory i WHERE i.itemId = :itemId AND i.customerId = :customerId")
    java.math.BigDecimal getTotalAvailableByItemAndCustomer(Long itemId, Long customerId);

    @Query("SELECT i FROM Inventory i WHERE i.customerId = :customerId AND i.availableQty > 0")
    List<Inventory> findAvailableInventoryByCustomer(Long customerId);
}
