package com.example.blog.app;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    @Column(nullable = false, unique=true)
    private String blogType;
    private String blogTittle;
    private String headline;
    @Lob
    private String blogDecription;
}
