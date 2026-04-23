package org.devops.mobileshop.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

@Document( collection = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Order {



    @Id
    private String id ;

    @DBRef
    private User user ;

    @DBRef
    private List<Product> productList;

    @DBRef
    private Deliver deliver;


    private double totalAmount ;
    private String status ; // pending , delivered , canceld

    private String  shippingAddress ;

    private String  billingAddress ;


    






}
