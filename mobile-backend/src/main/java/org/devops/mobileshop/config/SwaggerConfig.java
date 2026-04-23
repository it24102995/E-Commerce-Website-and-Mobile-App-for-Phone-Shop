package org.devops.mobileshop.config;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI mobileShopAPIDoc() {

        return new OpenAPI()
                .info(new Info()
                        .title(" mobile shop API DOC ")
                        .version("1.0")
                        .description(" description for mobile  shop api ")

                )
                ;

    }
}
