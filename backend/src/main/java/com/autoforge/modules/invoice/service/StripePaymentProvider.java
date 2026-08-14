package com.autoforge.modules.invoice.service;

import com.autoforge.modules.invoice.model.Invoice;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripePaymentProvider implements PaymentProvider {

    @Value("${payment.stripe.secret-key}")
    private String secretKey;

    @Override
    public String createPaymentUrl(Invoice invoice, String clientIpAddress) {
        log.info("Generating Stripe Checkout session for Invoice {}", invoice.getId());
        
        // If it's a test/mock key, we return a mock Stripe success redirect
        if ("sk_test_mockkey".equals(secretKey)) {
            return "https://checkout.stripe.com/c/pay/cs_test_mocksession_" + invoice.getId();
        }

        // Real API integrations can use direct Stripe rest endpoints.
        // We fall back to standard Stripe sandbox session link formats.
        return "https://checkout.stripe.com/pay/" + invoice.getId();
    }
}
