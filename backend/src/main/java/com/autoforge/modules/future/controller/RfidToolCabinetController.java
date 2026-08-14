package com.autoforge.modules.future.controller;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/rfid")
@RequiredArgsConstructor
public class RfidToolCabinetController {

    private final List<ToolLog> toolLogs = Collections.synchronizedList(new ArrayList<>());

    @PostMapping("/tool-movements")
    public ResponseEntity<ToolLog> recordToolMovement(@RequestBody ToolMovementPayload payload) {
        ToolLog logItem = new ToolLog();
        logItem.setId(UUID.randomUUID());
        logItem.setTechnicianId(payload.getTechnicianId());
        logItem.setTechnicianName(payload.getTechnicianId().contains("tech") || payload.getTechnicianId().contains("u-") ? "Lê Dũng" : "Nguyễn Văn A");
        logItem.setToolRfidCode(payload.getToolRfidCode());
        logItem.setToolName(getToolNameByRfid(payload.getToolRfidCode()));
        logItem.setAction(payload.getAction());
        logItem.setTimestamp(new Date().toString());

        toolLogs.add(0, logItem);

        return ResponseEntity.ok(logItem);
    }

    @GetMapping("/tool-movements")
    public ResponseEntity<List<ToolLog>> getAllToolLogs() {
        return ResponseEntity.ok(toolLogs);
    }

    private String getToolNameByRfid(String rfid) {
        if (rfid == null) return "Generic Tool";
        if (rfid.contains("wrench")) return "Snap-on Torque Wrench (1/2\" Drive)";
        if (rfid.contains("scanner")) return "OBD-II Wireless ECU Scanner";
        if (rfid.contains("gun")) return "Pneumatic Impact Air Gun";
        return "Specialized Hand Tool";
    }

    @Getter
    @Setter
    public static class ToolMovementPayload {
        private String technicianId;
        private String toolRfidCode;
        private String action; // CHECKOUT or CHECKIN
    }

    @Getter
    @Setter
    public static class ToolLog {
        private UUID id;
        private String technicianId;
        private String technicianName;
        private String toolRfidCode;
        private String toolName;
        private String action;
        private String timestamp;
    }
}
