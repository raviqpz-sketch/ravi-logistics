package com.ravilogistics.item.repository;

import com.ravilogistics.item.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    Optional<Warehouse> findByWarehouseCode(String warehouseCode);
    List<Warehouse> findByIsActiveTrue();
}
