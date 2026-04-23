package org.devops.mobileshop.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus( HttpStatus.BAD_REQUEST)
public class UserNotRegistered extends  RuntimeException {


    String message ;

    public UserNotRegistered( String message ) {


        super( message);

    }
}
