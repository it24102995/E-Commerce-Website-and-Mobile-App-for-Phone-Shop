package org.devops.mobileshop.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document ( collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    private  String id ;

    private String name ;

    private String email ;


    private String username ;
    private String phoneNumber ;

    private String role ;
    private String password ;


    @DBRef
    private List<Order> orders;
}
