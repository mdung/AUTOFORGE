package com.autoforge.core.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

@Service
public class BusinessMetricsService {

    private final Counter repairOrdersCreatedCounter;
    private final Counter invoicesIssuedCounter;

    public BusinessMetricsService(MeterRegistry registry) {
        this.repairOrdersCreatedCounter = Counter.builder("autoforge.repair.orders.created")
                .description("Total number of repair orders created")
                .register(registry);
        
        this.invoicesIssuedCounter = Counter.builder("autoforge.invoices.issued")
                .description("Total number of e-invoices issued")
                .register(registry);
    }

    public void incrementRepairOrders() {
        repairOrdersCreatedCounter.increment();
    }

    public void incrementInvoices() {
        invoicesIssuedCounter.increment();
    }
}
