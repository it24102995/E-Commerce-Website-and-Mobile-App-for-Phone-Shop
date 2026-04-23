package org.devops.mobileshop.service;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.devops.mobileshop.dto.LocationDto;
import org.devops.mobileshop.dto.LocationUpdateDto;
import org.devops.mobileshop.model.Location;
import org.devops.mobileshop.repository.DeliverRepository;
import org.devops.mobileshop.repository.LocationRepository;
import org.devops.mobileshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service

@RequiredArgsConstructor
public class LocationService {


    private final LocationRepository locationRepository;


    private final DeliverRepository deliverRepository;


    public List<LocationDto> getAllLocations( ) {

        return locationRepository.findAll().stream().map(

                location ->  new LocationDto( location.getName() , location.getLongitude()
                , location.getLatitude())
        ).collect(Collectors.toList()) ;






    }
    public LocationUpdateDto getOrderLocationByOrderId(String orderId){


         var location = locationRepository.findTopByOrderIdOrderByUpdatedTimeDesc(orderId).orElseThrow(

                 ()   -> new RuntimeException("order id not gound")
         );






         return new LocationUpdateDto( location.getOrderId() , location.getRiderId(), location.getLatitude(),

                 location.getLongitude());
    }


     public LocationDto saveLocation ( LocationDto locationDto) {




        Location  location  = new Location();


        location.setName(locationDto.name());
        location.setLongitude(location.getLatitude());
        location.setLatitude(location.getLatitude());


        locationRepository.save(location);

        return new LocationDto( location.getName() ,
                location.getLongitude() , location.getLatitude());
     }
}
