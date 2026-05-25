package com.ravilogistics.shipment.repository;

import com.ravilogistics.shipment.entity.Carrier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarrierRepository extends JpaRepository<Carrier, Long> {

    List<Carrier> findByIsActiveTrue();

    Optional<Carrier> findByCarrierCode(String carrierCode);
}
