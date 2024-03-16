package com.example.EMTECH_ERP.BACKEND.Utils.Shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@AllArgsConstructor
@NoArgsConstructor
@Data
@MappedSuperclass
public class DataPK {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
}
