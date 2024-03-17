package com.example.blog.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/blog")
public class BlogController {
    @Autowired
    private BlogService blogService;

    @PostMapping("/create")
    public EntityResponse createBlog(@RequestBody Blog blog){
    return blogService.createBlog(blog);
    }
}