package com.Dayflow.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateEmployeeProfileRequest {
    private String address;
    private String city;
    private String state;
    private String country;
    private String pinCode;

    @Pattern(regexp = "^$|^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;

    private String profilePictureUrl;
}
