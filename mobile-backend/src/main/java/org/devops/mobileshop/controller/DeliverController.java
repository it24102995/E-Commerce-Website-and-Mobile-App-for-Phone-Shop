package org.devops.mobileshop.controller;


import lombok.RequiredArgsConstructor;
import org.devops.mobileshop.dto.DeliverDto;
import org.devops.mobileshop.dto.LoginRequest;
import org.devops.mobileshop.dto.UserDto;
import org.devops.mobileshop.model.Deliver;
import org.devops.mobileshop.service.DeliverService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deliver")
@RequiredArgsConstructor

@CrossOrigin("*")

public class DeliverController {


    private final DeliverService deliverService;


    @PostMapping("/login")

    public DeliverDto loginDeliver(@RequestBody LoginRequest request) {

        return  deliverService.loginDeliver(request);



    }
}
