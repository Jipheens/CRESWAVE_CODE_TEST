package com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Requests;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNo;

}
