package com.ravilogistics.asn.controller;

import com.ravilogistics.asn.dto.AsnDTO;
import com.ravilogistics.asn.entity.Asn;
import com.ravilogistics.asn.entity.AsnLine;
import com.ravilogistics.asn.entity.Receipt;
import com.ravilogistics.asn.entity.ReceiptLine;
import com.ravilogistics.asn.service.AsnService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor

public class AsnController {

    private final AsnService asnService;

    // --- ASN endpoints ---

    @GetMapping("/asns")
    public ResponseEntity<List<Asn>> getAsns(@RequestParam(required = false) Long customerId) {
        return ResponseEntity.ok(asnService.getAllAsns(customerId));
    }

    @GetMapping("/asns/{id}")
    public ResponseEntity<Asn> getAsn(@PathVariable Long id) {
        return ResponseEntity.ok(asnService.getAsnById(id));
    }

    @GetMapping("/asns/{id}/lines")
    public ResponseEntity<List<AsnLine>> getAsnLines(@PathVariable Long id) {
        return ResponseEntity.ok(asnService.getAsnLines(id));
    }

    @PostMapping("/asns")
    public ResponseEntity<Asn> createAsn(@Valid @RequestBody AsnDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(asnService.createAsn(dto));
    }

    @PutMapping("/asns/{id}/status")
    public ResponseEntity<Asn> updateAsnStatus(@PathVariable Long id,
                                                @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(asnService.updateAsnStatus(id, status));
    }

    @PostMapping("/asns/{asnLineId}/receive")
    public ResponseEntity<ReceiptLine> receiveAsnLine(@PathVariable Long asnLineId,
                                                       @RequestBody Map<String, Object> body) {
        BigDecimal qty = new BigDecimal(body.get("qty").toString());
        Long locationId = body.get("locationId") != null
            ? Long.valueOf(body.get("locationId").toString())
            : null;
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(asnService.receiveAsnLine(asnLineId, qty, locationId));
    }

    // --- Receipt endpoints ---

    @GetMapping("/receipts")
    public ResponseEntity<List<Receipt>> getReceipts(@RequestParam(required = false) Long asnId) {
        return ResponseEntity.ok(asnService.getAllReceipts(asnId));
    }
}
