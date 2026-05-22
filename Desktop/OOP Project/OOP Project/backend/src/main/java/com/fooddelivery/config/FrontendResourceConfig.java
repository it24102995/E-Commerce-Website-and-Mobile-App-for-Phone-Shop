package com.fooddelivery.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FrontendResourceConfig implements WebMvcConfigurer {

    private final String frontendDirectory;

    public FrontendResourceConfig(@Value("${app.frontend.dir:../frontend}") String frontendDirectory) {
        this.frontendDirectory = frontendDirectory;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path frontendPath = Paths.get(frontendDirectory).toAbsolutePath().normalize();
        String frontendLocation = frontendPath.toUri().toString();

        registry.addResourceHandler("/assets/**")
                .addResourceLocations(frontendLocation + "assets/");
        registry.addResourceHandler("/*.html")
                .addResourceLocations(frontendLocation);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}