package com.autoforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class AutoForgeApplication {
    public static void main(String[] args) {
        SpringApplication.run(AutoForgeApplication.class, args);
    }
}
