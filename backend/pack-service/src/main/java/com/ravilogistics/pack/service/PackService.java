package com.ravilogistics.pack.service;

import com.ravilogistics.pack.dto.AddBoxDTO;
import com.ravilogistics.pack.dto.CreatePackTaskDTO;
import com.ravilogistics.pack.dto.PackItemDTO;
import com.ravilogistics.pack.entity.PackBox;
import com.ravilogistics.pack.entity.PackBoxItem;
import com.ravilogistics.pack.entity.PackTask;
import com.ravilogistics.pack.repository.PackBoxItemRepository;
import com.ravilogistics.pack.repository.PackBoxRepository;
import com.ravilogistics.pack.repository.PackTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PackService {

    private final PackTaskRepository packTaskRepository;
    private final PackBoxRepository packBoxRepository;
    private final PackBoxItemRepository packBoxItemRepository;

    public List<PackTask> getPackTaskByOrder(Long orderId) {
        return packTaskRepository.findByOrderId(orderId);
    }

    public PackTask getPackTaskById(Long id) {
        return packTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pack task not found with id: " + id));
    }

    @Transactional
    public PackTask createPackTask(CreatePackTaskDTO dto) {
        PackTask task = new PackTask();
        task.setOrderId(dto.getOrderId());
        task.setWarehouseId(dto.getWarehouseId());
        task.setStationCode(dto.getStationCode());
        task.setStatus("OPEN");
        return packTaskRepository.save(task);
    }

    @Transactional
    public PackTask startPackTask(Long packTaskId, String packerId) {
        PackTask task = getPackTaskById(packTaskId);
        task.setStatus("IN_PROGRESS");
        task.setPackerId(packerId);
        task.setStartedAt(LocalDateTime.now());
        return packTaskRepository.save(task);
    }

    @Transactional
    public PackBox addBox(AddBoxDTO dto) {
        // Verify pack task exists
        getPackTaskById(dto.getPackTaskId());

        // Determine next box sequence
        List<PackBox> existingBoxes = packBoxRepository.findByPackTaskId(dto.getPackTaskId());
        int nextSequence = existingBoxes.size() + 1;

        PackBox box = new PackBox();
        box.setPackTaskId(dto.getPackTaskId());
        box.setBoxSequence(nextSequence);
        box.setBoxType(dto.getBoxType());
        box.setLength(dto.getLength());
        box.setWidth(dto.getWidth());
        box.setHeight(dto.getHeight());
        box.setIsClosed(false);
        return packBoxRepository.save(box);
    }

    @Transactional
    public PackBoxItem packItem(PackItemDTO dto) {
        PackBox box = packBoxRepository.findById(dto.getBoxId())
                .orElseThrow(() -> new RuntimeException("Box not found with id: " + dto.getBoxId()));

        if (Boolean.TRUE.equals(box.getIsClosed())) {
            throw new RuntimeException("Cannot add items to a closed box");
        }

        PackBoxItem item = new PackBoxItem();
        item.setBoxId(dto.getBoxId());
        item.setOrderLineId(dto.getOrderLineId());
        item.setItemId(dto.getItemId());
        item.setPackedQty(dto.getPackedQty());
        item.setLotNumber(dto.getLotNumber());
        return packBoxItemRepository.save(item);
    }

    @Transactional
    public PackBox closeBox(Long boxId) {
        PackBox box = packBoxRepository.findById(boxId)
                .orElseThrow(() -> new RuntimeException("Box not found with id: " + boxId));
        box.setIsClosed(true);
        return packBoxRepository.save(box);
    }

    @Transactional
    public PackTask completePackTask(Long packTaskId) {
        PackTask task = getPackTaskById(packTaskId);

        // Validate all boxes are closed
        List<PackBox> boxes = packBoxRepository.findByPackTaskId(packTaskId);
        boolean allClosed = boxes.stream().allMatch(b -> Boolean.TRUE.equals(b.getIsClosed()));
        if (!allClosed) {
            throw new RuntimeException("All boxes must be closed before completing the pack task");
        }

        task.setStatus("COMPLETED");
        task.setCompletedAt(LocalDateTime.now());
        return packTaskRepository.save(task);
    }

    public List<PackBox> getBoxesByPackTask(Long packTaskId) {
        // Verify task exists
        getPackTaskById(packTaskId);
        return packBoxRepository.findByPackTaskId(packTaskId);
    }
}
