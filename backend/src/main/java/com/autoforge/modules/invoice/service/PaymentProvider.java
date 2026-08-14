package com.autoforge.modules.invoice.service;

import com.autoforge.modules.invoice.model.Invoice;

public interface PaymentProvider {
    String createPaymentUrl(Invoice invoice, String clientIpAddress);
}
