package org.example.competencymanagementsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.competencymanagementsystem.model.enums.UserRole;
import org.hibernate.annotations.ColumnDefault;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "app_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    private String jobTitle;
    private String location;
    private String phoneNumber;
    private String description;
    private String photoUrl;
    private String password;

    @Enumerated(EnumType.STRING)
    @ColumnDefault("'EMPLOYEE'")
    private UserRole userRole;

    @OneToMany(mappedBy = "user")
    private List<UserSkill> userSkills;

    @OneToMany(mappedBy = "user")
    private List<JobPostingApplicant> jobPostingApplicants;
}
