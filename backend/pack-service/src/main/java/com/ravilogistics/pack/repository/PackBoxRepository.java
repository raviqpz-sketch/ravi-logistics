package com.ravilogistics.pack.repository;

import com.ravilogistics.pack.entity.PackBox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackBoxRepository extends JpaRepository<PackBox, Long> {

    List<PackBox> findByPackTaskId(Long packTaskId);
}
