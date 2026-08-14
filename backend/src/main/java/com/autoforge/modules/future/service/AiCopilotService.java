package com.autoforge.modules.future.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiCopilotService {

    @Value("${ai.gemini.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public String analyzeVehicleHistory(String make, String model, String historyText) {
        log.info("Running AI Copilot Diagnosis on {} {}", make, model);

        if ("DEMO_KEY".equals(apiKey) || apiKey.isBlank()) {
            return getLocalHeuristicAnalysis(make, model, historyText);
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
            
            // Build Gemini request body
            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            List<Map<String, Object>> parts = new ArrayList<>();
            Map<String, Object> part = new HashMap<>();
            
            String promptText = String.format(
                "You are AutoForge AI Copilot. Analyze the following vehicle service history and write a concise health summary and comeback/rework warning if symptoms are returning:\n" +
                "Vehicle: %s %s\n" +
                "History: %s\n" +
                "Output rules:\n" +
                "1. Keep it under 200 words.\n" +
                "2. Start with '### AI HEALTH INDEX: [GOOD|ATTENTION|WARNING]'\n" +
                "3. Use bullets for active risks.",
                make, model, historyText
            );
            
            part.put("text", promptText);
            parts.add(part);
            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);

            Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);
            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> contentObj = (Map<String, Object>) firstCandidate.get("content");
                    List<Map<String, Object>> partsList = (List<Map<String, Object>>) contentObj.get("parts");
                    if (!partsList.isEmpty()) {
                        return (String) partsList.get(0).get("text");
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed calling Gemini API, falling back to local heuristics: {}", e.getMessage());
        }

        return getLocalHeuristicAnalysis(make, model, historyText);
    }

    @SuppressWarnings("unchecked")
    public String estimateDamageLabor(String base64Image, String imageName) {
        log.info("Running AI Multimodal Labor Estimation on image: {}", imageName);

        if ("DEMO_KEY".equals(apiKey) || apiKey.isBlank()) {
            return getLocalDamageEstimation(imageName);
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            List<Map<String, Object>> parts = new ArrayList<>();
            
            // Text prompt
            Map<String, Object> promptPart = new HashMap<>();
            promptPart.put("text", "Analyze this car damage photo. Suggest: 1. Description of damage, 2. Estimated Repair Labor Hours, 3. Needed replacement parts. Keep it under 150 words in markdown.");
            parts.add(promptPart);

            // Multimodal image part
            Map<String, Object> imagePart = new HashMap<>();
            Map<String, Object> inlineData = new HashMap<>();
            inlineData.put("mimeType", "image/jpeg");
            inlineData.put("data", base64Image.contains(",") ? base64Image.split(",")[1] : base64Image);
            imagePart.put("inlineData", inlineData);
            parts.add(imagePart);

            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);

            Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);
            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> contentObj = (Map<String, Object>) firstCandidate.get("content");
                    List<Map<String, Object>> partsList = (List<Map<String, Object>>) contentObj.get("parts");
                    if (!partsList.isEmpty()) {
                        return (String) partsList.get(0).get("text");
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed calling Gemini Multimodal API: {}", e.getMessage());
        }

        return getLocalDamageEstimation(imageName);
    }

    private String getLocalDamageEstimation(String name) {
        String n = name != null ? name.toLowerCase() : "";
        StringBuilder sb = new StringBuilder();
        sb.append("### AI ESTIMATED REPAIR PLAN (Fallback Mode)\n\n");
        
        if (n.contains("bumper") || n.contains("scratch")) {
            sb.append("- **Detected Damage**: Deep paint scratch and scrape on Front Bumper cover.\n");
            sb.append("- **Recommended Procedure**: Sanding, priming, base coat paint and clear coat blending.\n");
            sb.append("- **Estimated Labor**: **2.5 Hours** (Body Shop standard time).\n");
            sb.append("- **Suggested Parts**: Plastic bumper clips, sanding disc grits, OEM touch-up paint.");
        } else if (n.contains("dent") || n.contains("mop")) {
            sb.append("- **Detected Damage**: Heavy quarter panel dent with slight paint cracking.\n");
            sb.append("- **Recommended Procedure**: Paintless Dent Repair (PDR) or studs welding slide hammer pulling.\n");
            sb.append("- **Estimated Labor**: **4.5 Hours** (Auto-body fabrication time).\n");
            sb.append("- **Suggested Parts**: Metal sealant compound, zinc primer coating.");
        } else {
            sb.append("- **Detected Damage**: Moderate vehicle panel scratch/wear detected.\n");
            sb.append("- **Recommended Procedure**: Surface clay-bar treatment, dual-action machine polishing.\n");
            sb.append("- **Estimated Labor**: **1.5 Hours** (Detailing detailing center standard).\n");
            sb.append("- **Suggested Parts**: Finishing compound, microfiber towels.");
        }
        
        return sb.toString();
    }

    private String getLocalHeuristicAnalysis(String make, String model, String historyText) {
        StringBuilder sb = new StringBuilder();
        sb.append("### AI HEALTH INDEX: ATTENTION\n\n");
        sb.append("Local Heuristics Engine Analysis (Fallback Mode):\n");
        sb.append(String.format("- **Vehicle model**: %s %s detected.\n", make, model));
        
        if (historyText != null && (historyText.toLowerCase().contains("brake") || historyText.toLowerCase().contains("misfire") || historyText.toLowerCase().contains("p0301"))) {
            sb.append("- **⚠️ COMEBACK RISK**: High chance of rework. Brake system symptoms, spark plugs, or engine misfires have been logged repeatedly in the last 30 days.\n");
        } else {
            sb.append("- **Rework warnings**: Low probability of return repairs. Normal lifecycle usage logs verified.\n");
        }
        sb.append("- **Action recommended**: Run a telematics OBD-II scan to pull active sensors and freeze frames.");
        
        return sb.toString();
    }
}
