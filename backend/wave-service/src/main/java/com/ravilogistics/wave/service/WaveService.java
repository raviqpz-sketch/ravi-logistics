package com.ravilogistics.wave.service;

import com.ravilogistics.wave.dto.CreateWaveDTO;
import com.ravilogistics.wave.entity.Wave;
import com.ravilogistics.wave.entity.WaveOrder;
import com.ravilogistics.wave.repository.WaveOrderRepository;
import com.ravilogistics.wave.repository.WaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WaveService {

    private final WaveRepository waveRepository;
    private final WaveOrderRepository waveOrderRepository;

    public List<Wave> getAllWaves(Long warehouseId, String status) {
        if (warehouseId != null && status != null) {
            return waveRepository.findByWarehouseIdAndStatus(warehouseId, status);
        } else if (warehouseId != null) {
            return waveRepository.findByWarehouseId(warehouseId);
        } else if (status != null) {
            return waveRepository.findByStatus(status);
        }
        return waveRepository.findAll();
    }

    public Wave getWaveById(Long id) {
        return waveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wave not found with id: " + id));
    }

    @Transactional
    public Wave createWave(CreateWaveDTO dto) {
        Wave wave = new Wave();
        wave.setWarehouseId(dto.getWarehouseId());
        wave.setWaveDate(LocalDate.now());
        wave.setStatus("CREATED");
        wave.setCreatedBy(dto.getCreatedBy());
        wave.setTotalOrders(dto.getOrderIds() != null ? dto.getOrderIds().size() : 0);
        wave.setTotalLines(0);

        // Save first to get the generated ID
        Wave savedWave = waveRepository.save(wave);

        // Generate wave number using the saved wave ID
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String waveNumber = String.format("WAVE-%s-%04d", dateStr, savedWave.getWaveId());
        savedWave.setWaveNumber(waveNumber);
        savedWave = waveRepository.save(savedWave);

        // Create wave orders
        if (dto.getOrderIds() != null) {
            for (Long orderId : dto.getOrderIds()) {
                WaveOrder waveOrder = new WaveOrder();
                waveOrder.setWaveId(savedWave.getWaveId());
                waveOrder.setOrderId(orderId);
                waveOrderRepository.save(waveOrder);
            }
        }

        return savedWave;
    }

    @Transactional
    public Wave releaseWave(Long waveId) {
        Wave wave = getWaveById(waveId);
        wave.setStatus("RELEASED");
        wave.setReleasedAt(LocalDateTime.now());
        return waveRepository.save(wave);
    }

    @Transactional
    public Wave completeWave(Long waveId) {
        Wave wave = getWaveById(waveId);
        wave.setStatus("COMPLETED");
        wave.setCompletedAt(LocalDateTime.now());
        return waveRepository.save(wave);
    }

    public List<WaveOrder> getWaveOrders(Long waveId) {
        // Verify wave exists
        getWaveById(waveId);
        return waveOrderRepository.findByWaveId(waveId);
    }
}
