package com.ravilogistics.pick.controller;

import com.ravilogistics.pick.dto.ConfirmPickDTO;
import com.ravilogistics.pick.entity.PickConfirmation;
import com.ravilogistics.pick.entity.PickTask;
import com.ravilogistics.pick.service.PickService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/picks")
@RequiredArgsConstructor
public class PickController {

    private final PickService pickService;

    @GetMapping
    public ResponseEntity<List<PickTask>> getPickTasks(
            @RequestParam(required = false) Long waveId,
            @RequestParam(required = false) Long orderId,
            @RequestParam(required = false) String pickerId,
            @RequestParam(required = false) String status) {
        if (waveId != null) {
            return ResponseEntity.ok(pickService.getPickTasksByWave(waveId));
        } else if (orderId != null) {
            return ResponseEntity.ok(pickService.getPickTasksByOrder(orderId));
        } else if (pickerId != null) {
            return ResponseEntity.ok(pickService.getPickTasksByPicker(pickerId));
        }
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PickTask> getPickTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(pickService.getPickTaskById(id));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<PickTask> assignPickTask(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String pickerId = body.get("pickerId");
        return ResponseEntity.ok(pickService.assignPickTask(id, pickerId));
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<PickTask> confirmPick(
            @PathVariable Long id,
            @Valid @RequestBody ConfirmPickDTO dto) {
        return ResponseEntity.ok(pickService.confirmPick(id, dto));
    }

    @GetMapping("/{id}/confirmations")
    public ResponseEntity<List<PickConfirmation>> getConfirmations(@PathVariable Long id) {
        return ResponseEntity.ok(pickService.getConfirmationsByPickTask(id));
    }
}
