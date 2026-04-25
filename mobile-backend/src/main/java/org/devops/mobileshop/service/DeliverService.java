package org.devops.mobileshop.service;


import lombok.RequiredArgsConstructor;
import org.devops.mobileshop.dto.DeliverDto;
import org.devops.mobileshop.dto.LoginRequest;
import org.devops.mobileshop.dto.UserDto;
import org.devops.mobileshop.exception.PasswordInvalidException;
import org.devops.mobileshop.exception.UserNotRegistered;
import org.devops.mobileshop.model.Deliver;
import org.devops.mobileshop.model.User;
import org.devops.mobileshop.repository.DeliverRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class DeliverService {

    private final DeliverRepository
     deliverRepository;


    private final PasswordEncoder passwordEncoder;


     public UserDto createDeliver( UserDto request) {


         var  deliver = new Deliver();

         deliver.setEmail(request.email());
         deliver.setRole(request.role());
        deliver.setPassword(passwordEncoder.encode(request.password()));
        deliver.setUsername(request.username());
        //  set phone number method

         deliver.setPhoneNumber(request.phoneNumber());

         deliver.setName( request.name());



         // saving  the  deliver to the database
         deliverRepository.save(deliver);




        return  new UserDto(deliver.getUsername(), deliver.getRole(), deliver.getEmail(), deliver.getPhoneNumber(),
                deliver.getName(), deliver.getPassword()) ;
     }


      public DeliverDto loginDeliver(LoginRequest request) {



         var deliver = deliverRepository.findDeliverByEmail(request.email())



;

         if( deliver == null) {
               throw  new UserNotRegistered("  deliver is not registered");

         }

         if( !passwordEncoder.matches(request.password() , deliver.getPassword())){



              throw  new PasswordInvalidException("password is invalid please check again ");

         }

         return new DeliverDto(deliver.getId(),deliver.getUsername(), deliver.getRole(), deliver.getEmail(), deliver.getPhoneNumber(),
                 deliver.getName(),

                 deliver.getPassword());






     }

     public List<UserDto> getAllDelivers( ) {
         return   deliverRepository.findAll().stream().map( deliver ->  new UserDto(deliver.getUsername(), deliver.getRole(),
                 deliver.getEmail()
         ,deliver.getPhoneNumber(),
                 deliver.getName(),
                 deliver.getPassword()))
                 .collect(Collectors.toList());
     }
}
