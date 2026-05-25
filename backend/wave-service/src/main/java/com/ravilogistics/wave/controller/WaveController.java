package com.ravilogistics.wave.controller;

import com.ravilogistics.wave.dto.CreateWaveDTO;
import com.ravilogistics.wave.entity.Wave;
import com.ravilogistics.wave.entity.WaveOrder;
import com.ravilogistics.wave.service.WaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/waves")
@RequiredArgsConstructor
public class WaveController {

    private final WaveService waveService;

    @GetMapping
    public ResponseEntity<List<Wave>> getAllWaves(
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(waveService.getAllWaves(warehouseId, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Wave> getWaveById(@PathVariable Long id) {
        return ResponseEntity.ok(waveService.getWaveById(id));
    }

    @PostMapping
    public ResponseEntity<Wave> createWave(@Valid @RequestBody CreateWaveDTO dto) {
        Wave wave = waveService.createWave(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(wave);
    }

    @PostMapping("/{id}/release")
    public ResponseEntity<Wave> releaseWave(@PathVariable Long id) {
        return ResponseEntity.ok(waveService.releaseWave(id));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Wave> completeWave(@PathVariable Long id) {
        return ResponseEntity.ok(waveService.completeWave(id));
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<List<WaveOrder>> getWaveOrders(@PathVariable Long id) {
        return ResponseEntity.ok(waveService.getWaveOrders(id));
    }
}
