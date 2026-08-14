package com.autoforge.modules.future.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class EInvoiceService {

    private final Map<UUID, EInvoiceRecord> invoiceRegistry = new HashMap<>();

    public EInvoiceRecord issueVATInvoice(UUID invoiceId, String provider) {
        // Generate mock invoice details for e-invoice publishing
        String lookupCode = "VAT-" + (100000 + new Random().nextInt(900000));
        String invoiceLink = switch (provider) {
            case "VIETTEL" -> "https://sinvoice.viettel.vn/lookup/" + lookupCode;
            case "VNPT" -> "https://einvoice.vnpt.vn/lookup/" + lookupCode;
            default -> "https://meinvoice.vn/lookup/" + lookupCode;
        };

        EInvoiceRecord record = new EInvoiceRecord();
        record.setInvoiceId(invoiceId);
        record.setProvider(provider);
        record.setLookupCode(lookupCode);
        record.setLookupUrl(invoiceLink);
        record.setIssuedDate(new Date().toString());
        record.setStatus("PUBLISHED_TO_TAX_AGENCY");
        record.setTaxCode("0101234567-999");
        record.setVatRate(10.0);

        invoiceRegistry.put(invoiceId, record);
        return record;
    }

    public EInvoiceRecord getEInvoiceByInvoiceId(UUID invoiceId) {
        return invoiceRegistry.get(invoiceId);
    }

    @Getter
    @Setter
    public static class EInvoiceRecord {
        private UUID invoiceId;
        private String provider;
        private String lookupCode;
        private String lookupUrl;
        private String issuedDate;
        private String status;
        private String taxCode;
        private double vatRate;
    }
}
