package org.devops.mobileshop.controller;


import lombok.RequiredArgsConstructor;
import org.devops.mobileshop.dto.LocationDto;
import org.devops.mobileshop.dto.LocationUpdateDto;
import org.devops.mobileshop.dto.OrderResponseDto;
import org.devops.mobileshop.model.Location;
import org.devops.mobileshop.repository.LocationRepository;
import org.devops.mobileshop.service.LocationService;
import org.devops.mobileshop.service.OrderService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController

@CrossOrigin("*")

@RequestMapping("/api/location")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;
    private final LocationRepository locationRepository;


    private final OrderService orderService;
    private final SimpMessagingTemplate messagingTemplate;






    // rider send this location to the  front end

    @MessageMapping("/order/update-location")
    public void updateLocation( LocationUpdateDto request) {


        // save latest location to mongo db

        Location location =  new Location();
        location.setLatitude(
                 request.latitude()
        );

        location.setRiderId( request.riderId());
        location.setLongitude( request.longitude());

        location.setOrderId(request.orderId());
        location.setName(request.riderId());
        location.setUpdatedTime(LocalDateTime.now());



        locationRepository.save(location);


        // boroad cast to customer tracking

        messagingTemplate.convertAndSend(
                "topic/order" + request.orderId(),
                request
        );


    }


    @GetMapping("/{orderId}/track")

    public LocationUpdateDto getLastLocation( @PathVariable String orderId) {







        return locationService.getOrderLocationByOrderId(orderId);











    }




}
