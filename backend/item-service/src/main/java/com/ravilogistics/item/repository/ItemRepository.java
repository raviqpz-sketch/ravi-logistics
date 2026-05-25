package com.ravilogistics.item.repository;

import com.ravilogistics.item.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByCustomerIdAndIsActiveTrue(Long customerId);
    Optional<Item> findByCustomerIdAndItemCode(Long customerId, String itemCode);
    List<Item> findByCustomerIdAndCategoryAndIsActiveTrue(Long customerId, String category);
    boolean existsByCustomerIdAndItemCode(Long customerId, String itemCode);

    @Query("SELECT i FROM Item i WHERE i.customerId = :customerId AND " +
           "(LOWER(i.itemCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.itemName) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Item> searchItems(Long customerId, String search);
}
