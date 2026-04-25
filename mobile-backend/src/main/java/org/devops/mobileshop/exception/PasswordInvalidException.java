package org.devops.mobileshop.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class PasswordInvalidException  extends  RuntimeException{



    private  String message  ;

     public PasswordInvalidException( String message) {
         super(message);
     }



}
