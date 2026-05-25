package com.ravilogistics.pick.service;

import com.ravilogistics.pick.dto.ConfirmPickDTO;
import com.ravilogistics.pick.entity.PickConfirmation;
import com.ravilogistics.pick.entity.PickTask;
import com.ravilogistics.pick.repository.PickConfirmationRepository;
import com.ravilogistics.pick.repository.PickTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PickService {

    private final PickTaskRepository pickTaskRepository;
    private final PickConfirmationRepository pickConfirmationRepository;

    public List<PickTask> getPickTasksByWave(Long waveId) {
        return pickTaskRepository.findByWaveId(waveId);
    }

    public List<PickTask> getPickTasksByOrder(Long orderId) {
        return pickTaskRepository.findByOrderId(orderId);
    }

    public PickTask getPickTaskById(Long id) {
        return pickTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pick task not found with id: " + id));
    }

    public List<PickTask> getPickTasksByPicker(String pickerId) {
        return pickTaskRepository.findByPickerId(pickerId);
    }

    @Transactional
    public PickTask assignPickTask(Long pickTaskId, String pickerId) {
        PickTask task = getPickTaskById(pickTaskId);
        task.setStatus("ASSIGNED");
        task.setPickerId(pickerId);
        task.setAssignedAt(LocalDateTime.now());
        return pickTaskRepository.save(task);
    }

    @Transactional
    public PickTask confirmPick(Long pickTaskId, ConfirmPickDTO dto) {
        PickTask task = getPickTaskById(pickTaskId);

        // Create pick confirmation record
        PickConfirmation confirmation = new PickConfirmation();
        confirmation.setPickTaskId(pickTaskId);
        confirmation.setConfirmedQty(dto.getConfirmedQty());
        confirmation.setPickedBy(dto.getPickedBy());
        confirmation.setPickMethod(dto.getPickMethod());
        confirmation.setNotes(dto.getNotes());
        pickConfirmationRepository.save(confirmation);

        // Update confirmed qty on task
        task.setConfirmedQty(dto.getConfirmedQty());

        // Determine final status
        if (dto.getConfirmedQty().compareTo(task.getPickQty()) >= 0) {
            task.setStatus("COMPLETED");
        } else {
            task.setStatus("SHORT_PICKED");
        }
        task.setCompletedAt(LocalDateTime.now());

        return pickTaskRepository.save(task);
    }

    public List<PickTask> getOpenPicksByWave(Long waveId) {
        return pickTaskRepository.findByWaveId(waveId).stream()
                .filter(t -> "OPEN".equals(t.getStatus()) || "ASSIGNED".equals(t.getStatus()))
                .collect(Collectors.toList());
    }

    public List<PickConfirmation> getConfirmationsByPickTask(Long pickTaskId) {
        // Verify task exists
        getPickTaskById(pickTaskId);
        return pickConfirmationRepository.findByPickTaskId(pickTaskId);
    }
}
