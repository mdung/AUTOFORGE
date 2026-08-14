package com.autoforge.modules.checkin.controller;

import com.autoforge.modules.checkin.model.CheckIn;
import com.autoforge.modules.checkin.model.DamageRecord;
import com.autoforge.modules.checkin.service.CheckInService;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/checkins")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    @GetMapping
    public ResponseEntity<List<CheckIn>> getAllCheckIns() {
        return ResponseEntity.ok(checkInService.getAllCheckIns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CheckIn> getCheckInById(@PathVariable UUID id) {
        return ResponseEntity.ok(checkInService.getCheckInById(id));
    }

    @GetMapping("/{id}/damage")
    public ResponseEntity<List<DamageRecord>> getDamageRecords(@PathVariable UUID id) {
        return ResponseEntity.ok(checkInService.getDamageRecords(id));
    }

    @PostMapping
    public ResponseEntity<CheckIn> createCheckIn(@RequestBody CheckInRequest request) {
        CheckIn checkIn = checkInService.createCheckIn(request.getCheckIn(), request.getDamageRecords());
        return ResponseEntity.ok(checkIn);
    }

    @Getter
    @Setter
    public static class CheckInRequest {
        private CheckIn checkIn;
        private List<DamageRecord> damageRecords;
    }
}
