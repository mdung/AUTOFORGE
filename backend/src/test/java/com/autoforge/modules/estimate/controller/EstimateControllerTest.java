package com.autoforge.modules.estimate.controller;

import com.autoforge.modules.estimate.model.Estimate;
import com.autoforge.modules.estimate.service.EstimateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EstimateControllerTest {

    @Mock
    private EstimateService estimateService;

    @InjectMocks
    private EstimateController estimateController;

    private UUID estimateId;
    private Estimate estimate;

    @BeforeEach
    void setUp() {
        estimateId = UUID.randomUUID();
        estimate = new Estimate();
        estimate.setId(estimateId);
        estimate.setStatus("DRAFT");
    }

    @Test
    void getAllEstimates_returns200WithList() {
        when(estimateService.getAllEstimates()).thenReturn(List.of(estimate));
        ResponseEntity<List<Estimate>> response = estimateController.getAllEstimates();
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals(estimateId, response.getBody().get(0).getId());
    }

    @Test
    void getEstimateById_returns200WithEstimate() {
        when(estimateService.getEstimateById(estimateId)).thenReturn(estimate);
        ResponseEntity<Estimate> response = estimateController.getEstimateById(estimateId);
        assertNotNull(response.getBody());
        assertEquals("DRAFT", response.getBody().getStatus());
    }

    @Test
    void createEstimate_returns200WithCreatedEstimate() {
        when(estimateService.createEstimate(any(Estimate.class))).thenReturn(estimate);
        ResponseEntity<Estimate> response = estimateController.createEstimate(new Estimate());
        assertNotNull(response.getBody());
        assertEquals(estimateId, response.getBody().getId());
    }
}
