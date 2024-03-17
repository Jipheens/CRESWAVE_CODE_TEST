package com.example.EMTECH_ERP.BACKEND.Utils.Shared;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
@EqualsAndHashCode
public class Audittrails extends DataPK{
//    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
//    private String status = "Pending";
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String postedBy;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime postedTime;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Character postedFlag;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String modifiedBy;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime modifiedTime;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Character modifiedFlag;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String deletedBy;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime deletedTime;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Character deletedFlag;

//    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
//    private String postedBy;
//    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
//    private LocalDateTime postedTime;
//    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
//    private Character postedFlag;
}
