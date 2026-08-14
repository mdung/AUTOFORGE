package com.autoforge.modules.document.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import jakarta.annotation.PostConstruct;
import java.net.URI;
import java.time.Duration;
import java.util.UUID;

@Service
@Slf4j
public class MinioService {

    @Value("${aws.s3.endpoint}")
    private String endpoint;

    @Value("${aws.s3.access-key}")
    private String accessKey;

    @Value("${aws.s3.secret-key}")
    private String secretKey;

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    private S3Client s3Client;
    private S3Presigner s3Presigner;

    @PostConstruct
    public void init() {
        try {
            AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
            this.s3Client = S3Client.builder()
                    .endpointOverride(URI.create(endpoint))
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(credentials))
                    .forcePathStyle(true)
                    .build();

            this.s3Presigner = S3Presigner.builder()
                    .endpointOverride(URI.create(endpoint))
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(credentials))
                    .build();

            // Ensure bucket exists
            try {
                s3Client.headBucket(HeadBucketRequest.builder().bucket(bucketName).build());
            } catch (NoSuchBucketException e) {
                s3Client.createBucket(CreateBucketRequest.builder().bucket(bucketName).build());
                log.info("Created S3 bucket: {}", bucketName);
            }
            log.info("MinIO S3 client initialized successfully. Endpoint: {}", endpoint);
        } catch (Exception e) {
            log.warn("Failed to initialize MinIO S3 client. File operations will be unavailable: {}", e.getMessage());
        }
    }

    public String generatePresignedUploadUrl(String objectName) {
        if (s3Presigner == null) {
            log.warn("S3 presigner not initialized. Returning mock URL.");
            return endpoint + "/" + bucketName + "/" + objectName + "?mock=true";
        }
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .putObjectRequest(PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectName)
                        .build())
                .build();
        return s3Presigner.presignPutObject(presignRequest).url().toString();
    }

    public String generatePresignedDownloadUrl(String objectName) {
        if (s3Presigner == null) {
            return endpoint + "/" + bucketName + "/" + objectName + "?mock=true";
        }
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(60))
                .getObjectRequest(GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectName)
                        .build())
                .build();
        return s3Presigner.presignGetObject(presignRequest).url().toString();
    }

    public String uploadDocument(String fileName, byte[] content, String contentType) {
        String objectKey = UUID.randomUUID() + "/" + fileName;
        if (s3Client == null) {
            log.warn("S3 client not initialized. Cannot upload file: {}", fileName);
            return endpoint + "/" + bucketName + "/" + objectKey;
        }
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .contentType(contentType)
                    .build();
            s3Client.putObject(request, RequestBody.fromBytes(content));
            log.info("Uploaded document to S3: {}/{}", bucketName, objectKey);
            return endpoint + "/" + bucketName + "/" + objectKey;
        } catch (Exception e) {
            log.error("Failed to upload document to S3: {}", e.getMessage());
            throw new RuntimeException("File upload failed", e);
        }
    }

    public void deleteDocument(String objectKey) {
        if (s3Client == null) return;
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build());
            log.info("Deleted document from S3: {}", objectKey);
        } catch (Exception e) {
            log.warn("Failed to delete document from S3: {}", e.getMessage());
        }
    }
}
