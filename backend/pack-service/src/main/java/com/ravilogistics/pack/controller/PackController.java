package com.ravilogistics.pack.controller;

import com.ravilogistics.pack.dto.AddBoxDTO;
import com.ravilogistics.pack.dto.CreatePackTaskDTO;
import com.ravilogistics.pack.dto.PackItemDTO;
import com.ravilogistics.pack.entity.PackBox;
import com.ravilogistics.pack.entity.PackBoxItem;
import com.ravilogistics.pack.entity.PackTask;
import com.ravilogistics.pack.service.PackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/packs")
@RequiredArgsConstructor
public class PackController {

    private final PackService packService;

    @GetMapping
    public ResponseEntity<List<PackTask>> getPackTasks(
            @RequestParam(required = false) Long orderId) {
        if (orderId != null) {
            return ResponseEntity.ok(packService.getPackTaskByOrder(orderId));
        }
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PackTask> getPackTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(packService.getPackTaskById(id));
    }

    @PostMapping
    public ResponseEntity<PackTask> createPackTask(@Valid @RequestBody CreatePackTaskDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(packService.createPackTask(dto));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<PackTask> startPackTask(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String packerId = body.get("packerId");
        return ResponseEntity.ok(packService.startPackTask(id, packerId));
    }

    @PostMapping("/{id}/boxes")
    public ResponseEntity<PackBox> addBox(
            @PathVariable Long id,
            @Valid @RequestBody AddBoxDTO dto) {
        dto.setPackTaskId(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(packService.addBox(dto));
    }

    @PostMapping("/boxes/{boxId}/items")
    public ResponseEntity<PackBoxItem> packItem(
            @PathVariable Long boxId,
            @Valid @RequestBody PackItemDTO dto) {
        dto.setBoxId(boxId);
        return ResponseEntity.status(HttpStatus.CREATED).body(packService.packItem(dto));
    }

    @PostMapping("/boxes/{boxId}/close")
    public ResponseEntity<PackBox> closeBox(@PathVariable Long boxId) {
        return ResponseEntity.ok(packService.closeBox(boxId));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<PackTask> completePackTask(@PathVariable Long id) {
        return ResponseEntity.ok(packService.completePackTask(id));
    }

    @GetMapping("/{id}/boxes")
    public ResponseEntity<List<PackBox>> getBoxesByPackTask(@PathVariable Long id) {
        return ResponseEntity.ok(packService.getBoxesByPackTask(id));
    }
}
