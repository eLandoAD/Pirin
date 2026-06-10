package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.example", "com.pirin"})
@EnableJpaRepositories(basePackages = "com.pirin.repository")
@EntityScan(basePackages = "com.pirin.entity")
public class PirinApplication {
    public static void main(String[] args) {
        SpringApplication.run(PirinApplication.class, args);
    }
}