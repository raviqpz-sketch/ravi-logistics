package com.ravilogistics.wave.repository;

import com.ravilogistics.wave.entity.Wave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaveRepository extends JpaRepository<Wave, Long> {

    List<Wave> findByStatus(String status);

    List<Wave> findByWarehouseId(Long warehouseId);

    List<Wave> findByWarehouseIdAndStatus(Long warehouseId, String status);
}
