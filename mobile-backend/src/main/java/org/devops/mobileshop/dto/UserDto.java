package org.devops.mobileshop.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserDto(  @NotBlank @NotNull  String username , String role  , @NotBlank @NotNull  @Email String email , @NotBlank @NotNull  String phoneNumber , String name, @NotBlank @NotNull String password ) {


}
