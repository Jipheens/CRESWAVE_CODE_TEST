package com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Resources;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.MailService.MailService;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.MailService.MailsService;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.OTP.OTP;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.OTP.OTPRepository;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.OTP.OTPService;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Requests.*;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Responses.JwtResponse;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Responses.MessageResponse;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Roles.ERole;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Roles.Role;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Roles.RoleRepository;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Security.Jwt.JwtUtils;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Security.Services.UserDetailsImpl;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Users.UserStatusDTO;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Users.Users;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Users.UsersRepository;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Users.UsersService;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.utils.PasswordGeneratorUtil;
import com.example.EMTECH_ERP.BACKEND.Utils.Shared.EntityResponse;
import com.example.EMTECH_ERP.BACKEND.Utils.Shared.UserRequestContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
//import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsersRepository userRepository;
    @Autowired
    UsersService usersService;

    @Autowired
    RoleRepository roleRepository;

//    @Autowired
//    EmployeeRepository employeeRepository;

    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    OTPService otpService;

    @Autowired
    MailService mailService;
    @Autowired
    MailsService mailsService;
    @Value("${from_mail}")
    private String fromEmail;
    @Value("${emailOrganizationName}")
    private String emailOrganizationName;
    @Autowired
    OTPRepository otpRepository;

//    @PostMapping("/signup")
//    public EntityResponse<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) throws MessagingException {
//        EntityResponse response = new EntityResponse<>();
//
//
//        try {
//            if (!signUpRequest.getPassword().equals(signUpRequest.getConfirmPassword())){
//                response.setMessage("Passwords do not match. Please ensure that passwords match.");
//                response.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
//                return response;
//
//            }
//            if (userRepository.existsByUsername(signUpRequest.getUsername())){
//                response.setMessage("User name is already taken.");
//                response.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
//                return response;
//            } else if (userRepository.existsByEmail(signUpRequest.getEmail())) {
//                response.setMessage("Email is already taken.");
//                response.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
//                return response;
//            } else {
//                Users user = new Users();
//                user.setUsername(signUpRequest.getUsername());
//                user.setEmail(signUpRequest.getEmail());
//                user.setPassword(encoder.encode(signUpRequest.getPassword()));
//                Set<String> strRoles = signUpRequest.getRole();
//                Set<Role> roles = new HashSet<>();
//
//                if (strRoles == null || strRoles.isEmpty()) {
//                    Role userRole = roleRepository.findByName(ERole.ROLE_APPLICANT.toString())
//                            .orElseThrow(() -> new RuntimeException("Role not found."));
//                    roles.add(userRole);
//                } else {
//                    for (String role : signUpRequest.getRole()) {
//                        try {
//                            Role userRole = roleRepository.findByName(role)
//                                    .orElseThrow(() -> new RuntimeException("Role not found."));
//                            roles.add(userRole);
//                        } catch (RuntimeException e) {
//                            response.setMessage("Role not found: " + role);
//                            return response;
//                        }
//                    }
//                }
//
//                user.setRoles(roles);
//                user.setCreatedOn(new Date());
//                user.setDeleteFlag('N');
//                user.setAcctActive(true);
//                user.setAcctLocked(false);
//                user.setVerifiedFlag('Y');
//                user.setFirstLogin('Y');
//                user.setVerifiedOn(new Date());
//                user.setEmail(signUpRequest.getEmail());
//                user.setFirstName(signUpRequest.getFirstName());
//                user.setLastName(signUpRequest.getLastName());
//                user.setPhoneNo(signUpRequest.getPhoneNo());
//
//                Users users = userRepository.save(user);
//
////                String mailMessage = "Dear " + user.getFirstName() + " your account has been successfully created using username " + user.getUsername()
//                   String mailMessage = "<p>Dear <strong>" + user.getFirstName() +"</strong>,</p>\n" +
//                       " Your account has been successfully created using username " + user.getUsername()
//                        + " and password " + signUpRequest.getPassword();
//                String subject = "Account creation";
//
//                mailService.sendEmail(users.getEmail(),null,mailMessage,subject,false,null,null);
//                response.setMessage("User " + user.getUsername() + " registered successfully!");
//                response.setStatusCode(HttpStatus.CREATED.value());
//                response.setEntity(users);
//
//                return response;
//
//            }
//        } catch (Exception e) {
//            response.setMessage("An error occurred during user registration.");
//            return null;
//        }
//    }
    @PostMapping("/admin/signin")
    public ResponseEntity<?> signin(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse res) throws MessagingException {
        System.out.println("Authentication----------------------------------------------------------------------");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        Users user = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);
        log.info("Username is {}", loginRequest.getUsername());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        Cookie jwtTokenCookie = new Cookie("user-id", "c2FtLnNtaXRoQGV4YW1wbGUuY29t");
        jwtTokenCookie.setMaxAge(86400);
        jwtTokenCookie.setSecure(true);
        jwtTokenCookie.setHttpOnly(true);
        jwtTokenCookie.setPath("/user/");
        res.addCookie(jwtTokenCookie);
        Cookie accessTokenCookie = new Cookie("accessToken", jwt);
        accessTokenCookie.setMaxAge(1 * 24 * 60 * 60); // expires in 1 day
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setHttpOnly(true);
        res.addCookie(accessTokenCookie);
        Cookie userNameCookie = new Cookie("username", loginRequest.getUsername());
        accessTokenCookie.setMaxAge(1 * 24 * 60 * 60); // expires in 1 day
        res.addCookie(userNameCookie);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//        List<String> roles = userDetails.getAuthorities().stream()
//                .map(item -> item.getAuthority())
//                .collect(Collectors.toList());
//        String otp = "Your otp code is " + otpService.generateOTP(userDetails.getUsername());
//        mailService.sendEmail(userDetails.getEmail(), otp, "OTP Code");

        JwtResponse response = new JwtResponse();
        response.setToken(jwt);
        response.setType("Bearer");
        response.setId(userDetails.getId());
        response.setUsername(userDetails.getUsername());
        response.setEmail(userDetails.getEmail());
//        response.setRoles(roles);
//        response.setSolCode(user.getSolCode());
//        response.setEmpNo(user.getEmpNo());
        response.setFirstLogin(user.getFirstLogin());
//        response.setRoleClassification(user.getRoleClassification());
        response.setIsAcctActive(userDetails.getAcctActive());
        return ResponseEntity.ok(response);
    }

//    @PostMapping("/signin")
//    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse res) throws MessagingException {
//        EntityResponse response = new EntityResponse<>();
//
//        try {
//            System.out.println("Authentication----------------------------------------------------------------------");
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
//            Users user = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//            String jwt = jwtUtils.generateJwtToken(authentication);
//            Cookie jwtTokenCookie = new Cookie("user-id", "c2FtLnNtaXRoQGV4YW1wbGUuY29t");
//            jwtTokenCookie.setMaxAge(86400);
//            jwtTokenCookie.setSecure(true);
//            jwtTokenCookie.setHttpOnly(true);
//            jwtTokenCookie.setPath("/user/");
//            res.addCookie(jwtTokenCookie);
//            Cookie accessTokenCookie = new Cookie("accessToken", jwt);
//            accessTokenCookie.setMaxAge(1 * 24 * 60 * 60); // expires in 1 day
//            accessTokenCookie.setSecure(true);
//            accessTokenCookie.setHttpOnly(true);
//            res.addCookie(accessTokenCookie);
//            Cookie userNameCookie = new Cookie("username", loginRequest.getUsername());
//            accessTokenCookie.setMaxAge(1 * 24 * 60 * 60); // expires in 1 day
//            res.addCookie(userNameCookie);
//            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//            List<String> roles = userDetails.getAuthorities().stream()
//                    .map(item -> item.getAuthority())
//                    .collect(Collectors.toList());
//
//            JwtResponse jwtResponse = new JwtResponse();
//            jwtResponse.setToken(jwt);
//            jwtResponse.setType("Bearer");
//            jwtResponse.setId(userDetails.getId());
//            jwtResponse.setUsername(userDetails.getUsername());
//            jwtResponse.setEmail(userDetails.getEmail());
//            jwtResponse.setRoles(roles);
//            jwtResponse.setFirstLogin(user.getFirstLogin());
//            jwtResponse.setIsAcctActive(userDetails.getAcctActive());
//            jwtResponse.setPhoneNo(user.getPhoneNo());
//            jwtResponse.setFirstName(user.getFirstName());
//            jwtResponse.setLastName(user.getLastName());
//
//            response.setMessage("successfully signed in");
//            response.setStatusCode(HttpStatus.CREATED.value());
//            response.setEntity(jwtResponse);
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//        } catch (Exception e) {
//            response.setMessage("An error occurred during user authentication.");
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//        }
//    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        System.out.println("Logging out----------------------------------------------------------------------");
        // Invalidate user's session
        request.getSession().invalidate();

        // Clear authentication cookies
        Cookie jwtTokenCookie = new Cookie("user-id", null);
        jwtTokenCookie.setMaxAge(0);
        jwtTokenCookie.setSecure(true);
        jwtTokenCookie.setHttpOnly(true);
        jwtTokenCookie.setPath("/user/");
        response.addCookie(jwtTokenCookie);

        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setMaxAge(0);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setHttpOnly(true);
        response.addCookie(accessTokenCookie);

        Cookie userNameCookie = new Cookie("username", null);
        userNameCookie.setMaxAge(0);
        response.addCookie(userNameCookie);

        // You can also clear other cookies if needed

        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping(path = "/all/per/department")
    public List<UsersRepository.EmployeeAccount> allUsers(@RequestParam Long department_id){
        return userRepository.findByUserPerDepartment(department_id);
    }



    @GetMapping(path = "/users/{username}")
    public Users getUserByUsername(@PathVariable String username){
        return userRepository.findByUsername(username).orElse(null);
    }



//    @PutMapping(path = "/users/update")
//    public ResponseEntity<?> updateUser(@Valid @RequestBody Users user){
//
//        Set<Role> strRoles = new HashSet<>();
//        Set<Role> roles = user.getRoles();
//        roles.forEach(role -> {
//            Role userRole = roleRepository.findByName(role.getName())
//                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//            strRoles.add(userRole);
//        });
//        user.setRoles(strRoles);
//        user.setPassword(encoder.encode(user.getPassword()));
//        userRepository.save(user);
//        return ResponseEntity.ok(new MessageResponse("User Information has been successfully updated"));
//    }


    @PostMapping(path = "/verifyOTP")
    public ResponseEntity<?> validateOTP(@RequestBody OTPCode otpCode) {
        OTP otp = otpRepository.validOTP(otpCode.username);
        if (Objects.isNull(otp) || !Objects.equals(otp.getOtp(), otpCode.otp)) {
            return ResponseEntity.badRequest().body(new MessageResponse("OTP is not valid!"));
        } else {
            return ResponseEntity.ok(new MessageResponse("Welcome, OTP valid!"));
        }
    }
//    @GetMapping(path = "/roles")
//    public ResponseEntity<?> getRoles() {
//        return ResponseEntity.ok().body(roleRepository.findAll());
//    }
    @PostMapping(path = "/reset")
    public ResponseEntity<?> resetPasswordRequest(@RequestBody PasswordResetRequest passwordResetRequest) throws MessagingException {
        if (!(userRepository.existsByEmail(passwordResetRequest.getEmailAddress()))) {
            return ResponseEntity.badRequest().body(new MessageResponse("User with given email address does not exist."));
        } else {
            PasswordGeneratorUtil passwordGeneratorUtil = new PasswordGeneratorUtil();
            String generatedPassword = passwordGeneratorUtil.generatePassayPassword();
            String pathToReset = "Your Password has been successfully reset. Use the following password to login: " + generatedPassword;
            String subject = "Password Reset Notification";
            Users user = userRepository.findByEmail(passwordResetRequest.getEmailAddress()).orElse(null);
            assert user != null;
            user.setPassword(encoder.encode(generatedPassword));
            user.setFirstLogin('Y');
            userRepository.save(user);
            mailService.sendEmail(user.getEmail(), null,pathToReset,subject, false, "", null);
            return ResponseEntity.ok().body(new MessageResponse("Password Reset Successful."));
        }
    }


    @PostMapping(path = "/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest passwordResetRequest) {
        if (!userRepository.existsByEmail(passwordResetRequest.getEmailAddress())) {
            return ResponseEntity.badRequest().body(new MessageResponse("No such user exists"));
        } else {
            Users user = userRepository.findByEmail(passwordResetRequest.getEmailAddress()).orElse(null);
//            if (BCrypt.checkpw(passwordResetRequest.getOldPassword(), user.getPassword())) {
            if (passwordResetRequest.getPassword().equals(passwordResetRequest.getConfirmPassword())) {
                user.setPassword(encoder.encode(passwordResetRequest.getPassword()));
                user.setFirstLogin('N');
                userRepository.save(user);
                return ResponseEntity.ok().body(new MessageResponse("Password updated successfully"));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Password mismatch. Try Again"));
            }
        }
    }
    @GetMapping("get/users")
    public List<UserDTO> getAllUsersNoPass() {
        List<Users> users = usersService.getAllUsers();
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private UserDTO convertToDTO(Users user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getSn());
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNo(user.getPhoneNo());
        dto.setEmail(user.getEmail());
        return dto;
    }

    @DeleteMapping(path = "/permanent/delete/{sn}")
    public ResponseEntity<EntityResponse> deleteUserPermanently(@PathVariable Long sn){
        try{
            EntityResponse response = new EntityResponse<>();
            Optional<Users> usersOptional = userRepository.findById(sn);
            if (usersOptional.isPresent()) {
                userRepository.deleteById(sn);
                response.setMessage("User deleted successfully.");
                response.setStatusCode(HttpStatus.OK.value());
                response.setEntity("");
            } else {
                response.setMessage("User With Sn " + sn + " Does NOT Exist!");
                response.setStatusCode(HttpStatus.NOT_FOUND.value());
                response.setEntity("");
            }
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            log.info("Error {} " + e);
            return null;
        }

    }
    @PostMapping(path = "/forgot/password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPassword forgotpassword) throws MessagingException, IOException {
        if (!userRepository.existsByEmail(forgotpassword.getEmailAddress())) {
            EntityResponse response = new EntityResponse();
            response.setMessage("No account associated with the email provided "+forgotpassword.getEmailAddress());
            response.setStatusCode(HttpStatus.NOT_FOUND.value());
            response.setEntity("");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            PasswordGeneratorUtil passwordGeneratorUtil = new PasswordGeneratorUtil();
            String generatedPassword = passwordGeneratorUtil.generatePassayPassword();
            Optional<Users> user = userRepository.findByEmail(forgotpassword.getEmailAddress());
            if (user.isPresent()){
                Users existingUser = user.get();
                existingUser.setPassword(encoder.encode(generatedPassword));
                existingUser.setSystemGenPassword(true);
                existingUser.setModifiedBy(user.get().getUsername());
                //newuser.setModifiedBy(newuser.getUsername());
                existingUser.setModifiedOn(Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()));
                userRepository.save(existingUser);
                String subject = "PASSWORD RESET:";
                //String userIdentity = "User";
                String mailMessage = //"<p>Dear <strong>" + userIdentity  +"</strong>,</p>\n" +
                        "  <p>Your password has been successfully updated. Find the following credentials that you will use to access the application:</p>\n" +
                                "  <ul>\n" +
                                "    <li>Username: <strong>"+ user.get().getUsername() +"</strong></li>\n" +
                                "    <li>Password: <strong>"+ generatedPassword +"</strong></li>\n" +
                                "  </ul>\n" +
                                "  <p>Please login to change your password.</p>";
                mailsService.SendEmail(existingUser.getEmail(),null, mailMessage, subject, false, null, null);
                EntityResponse response = new EntityResponse();
                response.setMessage("Password Reset Successfully! Password has been sent to the requested email");
                response.setStatusCode(HttpStatus.OK.value());
                response.setEntity("");
                return new ResponseEntity<>(response, HttpStatus.OK);
            }else{
                EntityResponse response = new EntityResponse();
                response.setMessage("User with email address not found!");
                response.setStatusCode(HttpStatus.NOT_FOUND.value());
                response.setEntity("");
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        }
    }
    @PostMapping("/signup")
    public EntityResponse<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) throws MessagingException {
        EntityResponse response = new EntityResponse<>();


        try {
            if (!signUpRequest.getPassword().equals(signUpRequest.getConfirmPassword())) {
                response.setMessage("Passwords do not match. Please ensure that passwords match.");
                response.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
                return response;

            }
            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                response.setMessage("User name is already taken.");
                response.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
                return response;
            } else if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                response.setMessage("Email is already taken.");
                response.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
                return response;
            } else {
                Users user = new Users();
                user.setUsername(signUpRequest.getUsername());
                user.setEmail(signUpRequest.getEmail());
                user.setPassword(encoder.encode(signUpRequest.getPassword()));
//                Set<String> strRoles = signUpRequest.getRole();
//                Set<Role> roles = new HashSet<>();

//                if (strRoles == null || strRoles.isEmpty()) {
//                    Role userRole = roleRepository.findByName(ERole.ROLE_APPLICANT.toString())
//                            .orElseThrow(() -> new RuntimeException("Role not found."));
//                    roles.add(userRole);
//                } else {
//                    for (String role : signUpRequest.getRole()) {
//                        try {
//                            Role userRole = roleRepository.findByName(role)
//                                    .orElseThrow(() -> new RuntimeException("Role not found."));
//                            roles.add(userRole);
//                        } catch (RuntimeException e) {
//                            response.setMessage("Role not found: " + role);
//                            return response;
//                        }
//                    }
//                }

//                user.setRoles(roles);
                user.setCreatedOn(new Date());
                user.setDeletedFlag('N');
                user.setAcctActive(false);
                user.setAcctLocked(false);
                user.setStatus("PENDING");
                user.setVerifiedFlag('Y');
                user.setFirstLogin('Y');
                user.setVerifiedOn(new Date());
                user.setEmail(signUpRequest.getEmail());
                user.setFirstName(signUpRequest.getFirstName());
                user.setLastName(signUpRequest.getLastName());
                user.setPhoneNo(signUpRequest.getPhoneNo());

                Users users = userRepository.save(user);

//                String mailMessage = "Dear " + user.getFirstName() + " your account has been successfully created using username " + user.getUsername()
                String mailMessage = "<p>Dear <strong>" + user.getFirstName() + "</strong>,</p>\n" +
                        " Your account has been successfully created using username " + user.getUsername()
                        + " and password " + signUpRequest.getPassword();
                String subject = "Account creation";

                mailService.sendEmail(users.getEmail(), null, mailMessage, subject, false, null, null);
                response.setMessage("User " + user.getUsername() + " registered successfully!");
                response.setStatusCode(HttpStatus.CREATED.value());
                response.setEntity(users);

                return response;

            }
        } catch (Exception e) {
            log.error("Exception {}",e);
            response.setMessage("An error occurred during user registration ");
            return null;
        }
    }
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse res) throws MessagingException {
        EntityResponse response = new EntityResponse<>();
        // Check if the user exists based on the username
        Optional<Users> existingUserOptional = userRepository.findByUsername(loginRequest.getUsername());
        if (existingUserOptional.isEmpty()) {
            response.setMessage("User not found.");
            response.setStatusCode(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        Users existingUser = existingUserOptional.get();
        try {
            if (existingUser.getStatus().equals("PENDING")) {
//                response.setMessage("Your status is pending approval, contact the Admin!");
//                response.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
//                return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(response);
            }
            System.out.println("Authentication----------------------------------------------------------------------");
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            Cookie jwtTokenCookie = new Cookie("user-id", "c2FtLnNtaXRoQGV4YW1wbGUuY29t");
            jwtTokenCookie.setMaxAge(86400);
            jwtTokenCookie.setSecure(true);
            jwtTokenCookie.setHttpOnly(true);
            jwtTokenCookie.setPath("/user/");
            res.addCookie(jwtTokenCookie);
            Cookie accessTokenCookie = new Cookie("accessToken", jwt);
            accessTokenCookie.setMaxAge(1 * 24 * 60 * 60); // expires in 1 day
            accessTokenCookie.setSecure(true);
            accessTokenCookie.setHttpOnly(true);
            res.addCookie(accessTokenCookie);
            Cookie userNameCookie = new Cookie("username", loginRequest.getUsername());
            accessTokenCookie.setMaxAge(1 * 24 * 60 * 60); // expires in 1 day
            res.addCookie(userNameCookie);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//            List<String> roles = userDetails.getAuthorities().stream()
//                    .map(item -> item.getAuthority())
//                    .collect(Collectors.toList());

            JwtResponse jwtResponse = new JwtResponse();
            jwtResponse.setToken(jwt);
            jwtResponse.setType("Bearer");
            jwtResponse.setId(userDetails.getId());
            jwtResponse.setUsername(userDetails.getUsername());
            jwtResponse.setEmail(userDetails.getEmail());
//            jwtResponse.setRoles(roles);
            jwtResponse.setFirstLogin(existingUser.getFirstLogin());
            jwtResponse.setIsAcctActive(userDetails.getAcctActive());
            jwtResponse.setPhoneNo(existingUser.getPhoneNo());
            jwtResponse.setFirstName(existingUser.getFirstName());
            jwtResponse.setLastName(existingUser.getLastName());
            jwtResponse.setStatus("APPROVED");
            jwtResponse.setIsAcctActive(true);

            response.setMessage("successfully signed in");
            response.setStatusCode(HttpStatus.CREATED.value());
            response.setEntity(jwtResponse);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setMessage("An error occurred during user authentication.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    @PutMapping("/approveOrReject")
    public ResponseEntity<?> approveOrReject(@RequestBody List<UserStatusDTO>userStatusDTOList , @RequestParam String remarks){
        EntityResponse response = new EntityResponse<>();
        try {
            if (userStatusDTOList.isEmpty()){
                response.setMessage("you must provide at least one user for approval or rejection");
                response.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
            }else{
                List<Users> updatedUsers = new ArrayList<>();
                for (UserStatusDTO userStatusDTO :userStatusDTOList){
                    Optional<Users>OptionalUser = userRepository.findById(userStatusDTO.getSn());
                    if (OptionalUser.isPresent()){
                        Users user = OptionalUser.get();
                        String Status = userStatusDTO.getStatus().toUpperCase();
                        switch (Status){
                            case "APPROVED":
                                user.setStatus("APPROVED");
                                user.setAdminApprovedBy(UserRequestContext.getCurrentUser());
                                user.setApprovedTime(new Date());
                                user.setApprovedFlag('Y');
                                break;
                            case "REJECTED":
                                user.setStatus("REJECTED");
                                user.setApprovedFlag('N');
                                user.setAdminApprovedBy(null);
                                user.setApprovedTime(null);
                                break;
                            default:
                                response.setMessage("Invalid Status provided: "+ Status);
                                response.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
                                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);


                        }
                        updatedUsers.add(userRepository.save(user));

                    }else {
                        response.setMessage("No user found with such an Id: "+userStatusDTO.getSn());
                        response.setStatusCode(HttpStatus.NOT_FOUND.value());
                        return ResponseEntity.status(HttpStatus.NOT_FOUND.value()).body(response);

                    }

                }
                response.setMessage("User Status updated Successfully");
                response.setStatusCode(HttpStatus.OK.value());
                response.setEntity(updatedUsers);

            }

        }catch (Exception e){
            log.error(e.toString());
            response.setMessage("An unexpected error occurred while updating status");
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

        }
        return ResponseEntity.ok(response);

    }
    @GetMapping("/user/status")
    public EntityResponse<List<Users>>getUsersByStatus(@RequestParam String status) {
        return usersService.getUsersByStatus(status);
    }
//    @DeleteMapping("/{userId}")
//    public ResponseEntity<String> softDeleteUser(@PathVariable Long sn) {
//        Users user = userRepository.findById(sn).orElse(null);
//        if (user != null) {
//            user.setDeleted(true); // Set the flag indicating soft delete
//            userRepository.save(user);
//            return ResponseEntity.status(HttpStatus.OK).body("User soft deleted successfully");
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
//        }

//    }
@DeleteMapping("/delete")
public EntityResponse delete(@RequestParam Long sn) {return usersService.delete(sn);}

}

