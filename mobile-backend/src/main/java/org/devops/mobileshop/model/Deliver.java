package org.devops.mobileshop.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document( collection = "delivers")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Deliver {


    @Id
    private String id ;

    private String email ;
    private String username ;
    private String role ;
    private String password ;

    private String name ;

    @DBRef
    private Order order;

    private String phoneNumber ;





}
