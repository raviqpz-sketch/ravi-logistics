package com.ravilogistics.asn.repository;

import com.ravilogistics.asn.entity.Asn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AsnRepository extends JpaRepository<Asn, Long> {
    List<Asn> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Asn> findAllByOrderByCreatedAtDesc();
    Optional<Asn> findByAsnNumber(String asnNumber);
    List<Asn> findByCustomerIdAndStatus(Long customerId, String status);
    List<Asn> findByWarehouseIdAndStatus(Long warehouseId, String status);
    boolean existsByAsnNumber(String asnNumber);
}
