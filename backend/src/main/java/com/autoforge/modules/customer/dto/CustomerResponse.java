package com.autoforge.modules.customer.dto;

import lombok.*;
import java.util.UUID;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class CustomerResponse {
    private UUID id;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String type;
}
