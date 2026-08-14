package com.autoforge.modules.document.controller;

import com.autoforge.modules.document.service.MinioService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final MinioService minioService;

    @GetMapping("/presigned-upload")
    public ResponseEntity<String> getPresignedUploadUrl(@RequestParam String objectName) {
        return ResponseEntity.ok(minioService.generatePresignedUploadUrl(objectName));
    }

    @GetMapping("/presigned-download")
    public ResponseEntity<String> getPresignedDownloadUrl(@RequestParam String objectName) {
        return ResponseEntity.ok(minioService.generatePresignedDownloadUrl(objectName));
    }

    @PostMapping("/upload")
    public ResponseEntity<String> upload(@RequestBody UploadPayload payload) {
        byte[] content = java.util.Base64.getDecoder().decode(payload.getContentBase64());
        String url = minioService.uploadDocument(payload.getFileName(), content, payload.getContentType());
        return ResponseEntity.ok(url);
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@RequestParam String objectKey) {
        minioService.deleteDocument(objectKey);
        return ResponseEntity.noContent().build();
    }

    @Getter
    @Setter
    public static class UploadPayload {
        private String fileName;
        private String contentBase64;
        private String contentType;
    }
}
