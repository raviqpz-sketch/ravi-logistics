package com.ravilogistics.pick;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class PickServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PickServiceApplication.class, args);
    }
}
