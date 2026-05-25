package com.ravilogistics.inventory.repository;

import com.ravilogistics.inventory.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    List<InventoryTransaction> findByInventoryId(Long inventoryId);

    List<InventoryTransaction> findByItemIdAndCustomerId(Long itemId, Long customerId);

    List<InventoryTransaction> findByTxnType(String txnType);

    List<InventoryTransaction> findByReferenceTypeAndReferenceId(String referenceType, Long referenceId);
}
