package com.ravilogistics.item.repository;

import com.ravilogistics.item.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByCustomerCode(String customerCode);
    List<Customer> findByIsActiveTrue();
    boolean existsByCustomerCode(String customerCode);
}
