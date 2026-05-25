package com.ravilogistics.pick.repository;

import com.ravilogistics.pick.entity.PickTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PickTaskRepository extends JpaRepository<PickTask, Long> {

    List<PickTask> findByWaveId(Long waveId);

    List<PickTask> findByOrderId(Long orderId);

    List<PickTask> findByStatus(String status);

    List<PickTask> findByPickerId(String pickerId);

    List<PickTask> findByWaveIdAndStatus(Long waveId, String status);

    List<PickTask> findByOrderIdAndStatus(Long orderId, String status);
}
