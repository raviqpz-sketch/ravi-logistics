package com.ravilogistics.asn.repository;

import com.ravilogistics.asn.entity.AsnLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AsnLineRepository extends JpaRepository<AsnLine, Long> {
    List<AsnLine> findByAsnIdOrderByLineNumber(Long asnId);
    List<AsnLine> findByAsnIdAndStatus(Long asnId, String status);
    long countByAsnId(Long asnId);
    long countByAsnIdAndStatus(Long asnId, String status);
}
