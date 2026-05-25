package com.ravilogistics.wave.repository;

import com.ravilogistics.wave.entity.WaveOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaveOrderRepository extends JpaRepository<WaveOrder, Long> {

    List<WaveOrder> findByWaveId(Long waveId);

    List<WaveOrder> findByOrderId(Long orderId);

    boolean existsByWaveIdAndOrderId(Long waveId, Long orderId);
}
