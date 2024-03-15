package com.example.EMTECH_ERP.BACKEND.AuthenticationModule.OTP;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "otp")
public class OTP {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sn")
    private Integer sn;
    @Column(name = "otp", nullable = false)
    private Integer otp;
    @Column(name = "username", nullable = false)
    private String username;
    @Column(name = "req_time", nullable = false)
    private Date requestedTime;

}
