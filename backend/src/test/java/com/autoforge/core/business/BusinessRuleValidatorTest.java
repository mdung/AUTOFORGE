package com.autoforge.core.business;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.*;

class BusinessRuleValidatorTest {

    private final BusinessRuleValidator validator = new BusinessRuleValidator();

    @ParameterizedTest
    @CsvSource({
        "DRAFT, CHECKED_IN",
        "DRAFT, APPROVED",
        "CHECKED_IN, INSPECTION",
        "INSPECTION, WAITING_APPROVAL",
        "WAITING_APPROVAL, APPROVED",
        "APPROVED, READY_FOR_WORK",
        "READY_FOR_WORK, IN_PROGRESS",
        "IN_PROGRESS, QUALITY_CONTROL",
        "IN_PROGRESS, WAITING_PARTS",
        "WAITING_PARTS, IN_PROGRESS",
        "QUALITY_CONTROL, READY_FOR_DELIVERY",
        "QUALITY_CONTROL, IN_PROGRESS",
        "READY_FOR_DELIVERY, DELIVERED",
        "DELIVERED, CLOSED"
    })
    void validTransitions_shouldNotThrow(String from, String to) {
        assertDoesNotThrow(() -> validator.validateStateTransition(from, to));
    }

    @ParameterizedTest
    @CsvSource({
        "DRAFT, DELIVERED",
        "DRAFT, IN_PROGRESS",
        "DRAFT, QUALITY_CONTROL",
        "IN_PROGRESS, DELIVERED",
        "APPROVED, DELIVERED",
        "CLOSED, IN_PROGRESS",
        "DELIVERED, IN_PROGRESS"
    })
    void invalidTransitions_shouldThrow(String from, String to) {
        assertThrows(IllegalStateException.class, 
            () -> validator.validateStateTransition(from, to));
    }

    @ParameterizedTest
    @CsvSource({
        "DRAFT, CANCELLED",
        "CHECKED_IN, CANCELLED",
        "INSPECTION, CANCELLED",
        "WAITING_APPROVAL, CANCELLED",
        "APPROVED, CANCELLED",
        "READY_FOR_WORK, CANCELLED",
        "IN_PROGRESS, CANCELLED",
        "WAITING_PARTS, CANCELLED"
    })
    void cancellation_allowedFromOpenStates(String from, String to) {
        assertDoesNotThrow(() -> validator.validateStateTransition(from, to));
    }

    @Test
    void qcGating_blockWhenNotPassed() {
        assertThrows(IllegalStateException.class,
            () -> validator.enforceQcGating(false));
    }

    @Test
    void qcGating_passWhenPassed() {
        assertDoesNotThrow(() -> validator.enforceQcGating(true));
    }

    @Test
    void sameStatus_shouldNotThrow() {
        assertDoesNotThrow(() -> validator.validateStateTransition("IN_PROGRESS", "IN_PROGRESS"));
    }

    @Test
    void nullStatus_shouldNotThrow() {
        assertDoesNotThrow(() -> validator.validateStateTransition(null, "APPROVED"));
        assertDoesNotThrow(() -> validator.validateStateTransition("DRAFT", null));
    }
}
