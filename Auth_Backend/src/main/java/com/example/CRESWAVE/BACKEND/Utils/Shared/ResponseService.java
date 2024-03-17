package com.example.EMTECH_ERP.BACKEND.Utils.Shared;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ResponseService {
    private static EntityResponse response = new EntityResponse<>();
    private static  EntityResponse CREATED(String message,Object entity){
        response.setStatusCode(HttpStatus.CREATED.value());
        response.setMessage(message.toUpperCase());
        response.setEntity(entity);
        return response;
    }
    private static EntityResponse NOT_FOUND(String message){
        response.setStatusCode(HttpStatus.NOT_FOUND.value());
        response.setMessage(message.toUpperCase());
        response.setEntity(null);
        return response;
    }
    private static EntityResponse FOUND(String message,Object entity){
        response.setStatusCode(HttpStatus.FOUND.value());
        response.setMessage(message.toUpperCase());
        response.setEntity(entity);
        return response;
    }
    private static EntityResponse MODIFIED(String message,Object entity){
        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage(message.toUpperCase());
        response.setEntity(entity);
        return response;
    }
    private static EntityResponse NOT_ACCEPTABLE(String message){
        response.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
        response.setMessage(message.toUpperCase());
        response.setEntity(null);
        return response;
    }
    private static EntityResponse OK(String message,Object entity){
        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage(message.toUpperCase());
        response.setEntity(entity);
        return response;
    }
    private static EntityResponse EXCEPTION(String message){
        response.setStatusCode(HttpStatus.EXPECTATION_FAILED.value());
        response.setMessage(message.toUpperCase());
        response.setEntity(null);
        return response;
    }
    private static EntityResponse INTERNAL_SERVER_ERROR(String message){
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setMessage(message.toUpperCase());
        response.setEntity(null);
        return response;
    }
}
