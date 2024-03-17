package com.example.blog.app;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@AllArgsConstructor
@NoArgsConstructor
@Data
public class EntityResponse <T>
{
    private String message;
    private T entity;
    private Integer statusCode;
}
