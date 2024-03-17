package com.example.EMTECH_ERP.BACKEND.Utils.Shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class EntityResponse<T> {
    private String message;
    private T entity;
    private Integer statusCode;
}

