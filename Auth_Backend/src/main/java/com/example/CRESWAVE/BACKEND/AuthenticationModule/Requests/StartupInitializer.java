package com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Requests;

import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Roles.ERole;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Roles.Role;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Roles.RoleRepository;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Users.Users;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Users.UsersRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Date;
@Component
@Slf4j
public class StartupInitializer implements ApplicationRunner {

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        createSuperUser();
    }

    private void createSuperUser() {
        log.info("------->>>>>> CREATING SUPERUSER <<<<<<-------------");

        if (userRepository.existsByUsername("superuser")) {
            log.info("username exists!.Skipping creation");
        }else if (userRepository.existsByEmail("superuser@example.com")) {
            log.info("Superuser with email superuser@example.com already exists. Skipping creation.");
        }else{
//            Role superUserRole = roleRepository.findByName(ERole.ROLE_SUPERUSER.toString())
            Role superUserRole = new Role();
            superUserRole.setName(ERole.ROLE_SUPERUSER.toString());
            roleRepository.save(superUserRole);
            log.info("Role found!");
            Users superUser = new Users();
            superUser.setUsername("superuser");
            superUser.setEmail("superuser@example.com");
            superUser.setPassword(passwordEncoder.encode("SOLUTIONKE"));
            superUser.setRoles(Collections.singleton(superUserRole));
            superUser.setAcctActive(true);
            superUser.setAcctLocked(false);
            superUser.setStatus("ACTIVE");
            log.info("username = superuser");
            log.info("superuser  log in password is = SOLUTIONKE ");
            superUser.setVerifiedFlag('Y');
            superUser.setFirstLogin('Y');
            superUser.setVerifiedOn(new Date());
            superUser.setEmail("superuser@example.com");
            superUser.setFirstName("Super");
            superUser.setLastName("User");
            superUser.setPhoneNo("1234567890");

            userRepository.save(superUser);
        }
    }
}