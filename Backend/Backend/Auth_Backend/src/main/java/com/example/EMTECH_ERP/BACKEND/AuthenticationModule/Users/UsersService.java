package com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Users;
import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Roles.RoleRepository;
import com.example.EMTECH_ERP.BACKEND.Utils.Shared.EntityResponse;
import com.example.EMTECH_ERP.BACKEND.Utils.Shared.UserRequestContext;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    private final Date today = new Date();

    public Users userRegistration(Users user){
//        roleRepository.saveAll(user.getRoles());
        user.setCreatedOn(this.today);
        user.setDeletedFlag('N');
//        user.setModifiedOn(this.today);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return usersRepository.save(user);
    }

    public Users updateUser(Users user){
        return usersRepository.save(user);
    }

    public List<Users> getAllUsers(){
        return usersRepository.findAllByDeletedFlag('N');
    }

    public Users getUser(Long id) {
        return usersRepository.findById(id).orElse(null);
    }


//    public EntityResponse lockUserAccount(String empNo) {
//        try {
//            EntityResponse response = new EntityResponse();
//            Optional<Users> userOptional = usersRepository.findByEmpNo(empNo);
//            if (userOptional.isPresent()) {
//                Users user = userOptional.get();
//                user.setAcctLocked(true);
//                user.setAcctActive(false);
//                user.setDeleteFlag('Y');
//                user.setDeletedOn(this.today);
//                Users updatedUser = usersRepository.save(user);
//                response.setMessage("User Account For Employee With employee number " + empNo + "Locked Successfully.");
//                response.setStatusCode(HttpStatus.OK.value());
//                response.setEntity(updatedUser);
//            } else {
//                response.setMessage(HttpStatus.NOT_FOUND.getReasonPhrase());
//                response.setStatusCode(HttpStatus.NOT_FOUND.value());
//                response.setEntity("");
//            }
//            return response;
//        } catch (Exception e) {
//            log.info("Error {} " + e);
//            return null;
//        }
//    }
public EntityResponse getUsersByStatus(String status) {
    EntityResponse entityResponse = new EntityResponse<>();
    try {
        List<Users> users = usersRepository.findByStatusAndDeletedFlag(status,'N');
        if (users.isEmpty()) {
            entityResponse.setMessage("No user found with status: " + status);
            entityResponse.setStatusCode((HttpStatus.NOT_FOUND.value()));
        } else {
            entityResponse.setEntity(users);
            entityResponse.setMessage("Users fetched successfully");
            entityResponse.setStatusCode(HttpStatus.OK.value());
        }
    }catch (Exception e) {

        log.error("An error occurred while fetching users by status {}", e);
        entityResponse.setMessage("Failed to fetch users by status");
        entityResponse.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
    }
    return entityResponse;
}
    public EntityResponse delete(Long sn) {
        EntityResponse entityResponse = new EntityResponse<>();
        try {
            Optional<Users> existingUserOptional = usersRepository.findById(sn);

            if (existingUserOptional.isPresent()) {
                Users existingUser = existingUserOptional.get();

                // Set flags
                existingUser.setDeletedFlag('Y');
                existingUser.setDeletedBy(UserRequestContext.getCurrentUser());
                existingUser.setDeletedOn(LocalDateTime.now());

                // Save changes with flags
                usersRepository.save(existingUser);

                entityResponse.setMessage("User Deleted Successfully");
                entityResponse.setStatusCode(HttpStatus.OK.value());
                entityResponse.setEntity(existingUser);
            } else {
                entityResponse.setStatusCode(HttpStatus.NO_CONTENT.value());
                entityResponse.setMessage("Failed to update delete flag. Employee not found.");
                entityResponse.setEntity(null);
            }
        } catch (Exception e) {
            log.error("An error occurred while updating delete flag: " + e.getMessage());
            entityResponse.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            entityResponse.setMessage("An error occurred while updating delete flag");
            entityResponse.setEntity(null);
        }
        return entityResponse;
    }
    public List<Users> fetchAllUsers(){
        return usersRepository.findAll();
    }

}
