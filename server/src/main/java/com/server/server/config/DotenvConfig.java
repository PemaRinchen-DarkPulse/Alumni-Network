package com.server.server.config;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

public class DotenvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        
        // Try to load .env file from server directory
        Path envPath = Paths.get(System.getProperty("user.dir"), ".env");
        
        if (!Files.exists(envPath)) {
            // If not found, try parent directory (for cases where the app runs from project root)
            envPath = Paths.get(System.getProperty("user.dir"), "server", ".env");
        }
        
        if (Files.exists(envPath)) {
            Properties props = new Properties();
            try (FileInputStream fis = new FileInputStream(envPath.toFile())) {
                props.load(fis);
                environment.getPropertySources().addFirst(new PropertiesPropertySource("dotenv", props));
                System.out.println("Loaded .env file from: " + envPath);
            } catch (IOException e) {
                System.err.println("Error loading .env file: " + e.getMessage());
            }
        } else {
            System.err.println(".env file not found at: " + envPath);
        }
    }
}
