package com.example.blog.app;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class BlogService {
@Autowired
    private BlogRepo blogRepo;

public EntityResponse createBlog(Blog blog){
    EntityResponse entityResponse=new EntityResponse();
    try {

    }
    catch (Exception exception){

    }
        return entityResponse;
}
}
