package org.devops.mobileshop.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document( collection = "locations")
@AllArgsConstructor
@NoArgsConstructor
@Data

public class Location {



    @Id
    private String id  ;

    private String riderId ;
    private String name  ;
    private double latitude ;
    private String orderId ;
    private double longitude ;

    private LocalDateTime updatedTime ;


}
