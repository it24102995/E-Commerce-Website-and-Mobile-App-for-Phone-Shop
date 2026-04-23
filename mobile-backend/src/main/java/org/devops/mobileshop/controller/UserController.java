package org.devops.mobileshop.controller;


import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.devops.mobileshop.dto.LoginRequest;
import org.devops.mobileshop.dto.UserDto;
import org.devops.mobileshop.dto.UserResponseDto;
import org.devops.mobileshop.service.DeliverService;
import org.devops.mobileshop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping( "/api/user")


@CrossOrigin("*")

@RequiredArgsConstructor

public class UserController {


    private final UserService userService;

    private final DeliverService deliverService;



    @PostMapping("/register")
     public UserResponseDto createUser(@RequestBody UserDto request) {

         return userService.createUser(request);

     }

     @GetMapping("/{userId}")

     public UserResponseDto getUserById( @PathVariable String userId) {


        return userService.getUserById(userId);
     }

     @PostMapping("/deliver")
    public UserDto createDeliver( @RequestBody UserDto request) {


        return  deliverService.createDeliver(request);
     }

     @PostMapping("/login")
     public UserResponseDto loginUser( @RequestBody LoginRequest request) {
        return userService.loginUser( request);

     }


     @GetMapping("/deliver/all")
    public List<UserDto> getAllDelivers( ) {


         return deliverService.getAllDelivers();
     }



}
