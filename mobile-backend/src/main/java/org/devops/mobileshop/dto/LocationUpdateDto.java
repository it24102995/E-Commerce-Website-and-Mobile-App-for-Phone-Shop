package org.devops.mobileshop.dto;

public record LocationUpdateDto(


        String orderId ,
        String riderId ,

        double  latitude ,
        double longitude
) {
}
