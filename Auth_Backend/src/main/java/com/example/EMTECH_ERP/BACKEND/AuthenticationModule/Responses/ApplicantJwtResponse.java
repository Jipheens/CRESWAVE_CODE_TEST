package com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Responses;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class ApplicantJwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    //    private List<String> roles;
//    private String solCode;
    private Character firstLogin;
    //    private String roleClassification;
    private Boolean isAcctActive;
}
