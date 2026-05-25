package com.ravilogistics.shipment.repository;

import com.ravilogistics.shipment.entity.ShipmentBox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipmentBoxRepository extends JpaRepository<ShipmentBox, Long> {

    List<ShipmentBox> findByShipmentId(Long shipmentId);
}
