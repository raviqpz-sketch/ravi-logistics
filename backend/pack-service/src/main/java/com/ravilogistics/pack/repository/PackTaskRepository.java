package com.ravilogistics.pack.repository;

import com.ravilogistics.pack.entity.PackTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackTaskRepository extends JpaRepository<PackTask, Long> {

    List<PackTask> findByOrderId(Long orderId);

    List<PackTask> findByStatus(String status);
}
