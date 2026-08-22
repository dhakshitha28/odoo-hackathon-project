package com.Dayflow.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String loginId;

    @Column(nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    @Column(nullable = false)
    private boolean emailVerified = false;

    @Column(nullable = false)
    private int yearOfJoining;

    private String profilePictureUrl;

    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String department;

    private String jobPosition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    private LocalDate dateOfJoining;

    @Enumerated(EnumType.STRING)
    private EmploymentType employmentType;

    private String address;

    private String city;

    private String state;

    private String country;

    private String pinCode;

    @Column(length = 2000)
    private String skills;

    @Column(length = 2000)
    private String certifications;

    private String resumeUrl;

    private String nationality;

    private String personalEmail;

    @Enumerated(EnumType.STRING)
    private MaritalStatus maritalStatus;

    private Double salary;

    private String accountNumber;

    private String bankName;

    private String ifscCode;

    private String panNumber;

    private String uanNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
