package org.devops.mobileshop.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class LocationUpdate {

    private double latitude ;
    private double longitude ;
    private String timestamp ;
    private String note  ;



}
