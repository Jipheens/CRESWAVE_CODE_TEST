package com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Users;

import com.example.EMTECH_ERP.BACKEND.AuthenticationModule.Roles.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByUsername(String username);

//    Optional<Users> findByEmpNo(String empNo);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    Boolean existsByPhoneNo(String phone);

    Optional<Users> findByEmail(String email);

    @Query(value = "SELECT users.sn as UserId, employee.id as Employeeid, employee.department_id as Departmentid, employee.first_name as Firstname, employee.middle_name as Middlename, employee.last_name as Lastname FROM employee JOIN users ON employee.id = users.employee_id WHERE employee.department_id=:department_id",nativeQuery = true)
    List<EmployeeAccount> findByUserPerDepartment(Long department_id);

    Optional<Users> findByFirstName(String firstName);

    List<Users> findByStatusAndDeletedFlag(String status, char deletedFlag);

    List<Users> findAllByDeletedFlag(char deletedFlag);

    Optional<Users> findBysn(Long sn);

    boolean existsByRoles_Name(String string);


    interface EmployeeAccount{
        Long getUserId();
        Long getEmployeeid();
        Long getDepartmentid();
        String getFirstname();
        String getMiddlename();
        String getLastname();
    }

}



