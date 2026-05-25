package com.ravilogistics.pack.repository;

import com.ravilogistics.pack.entity.PackBoxItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackBoxItemRepository extends JpaRepository<PackBoxItem, Long> {

    List<PackBoxItem> findByBoxId(Long boxId);
}
