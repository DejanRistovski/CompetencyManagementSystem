package org.example.competencymanagementsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String postingTitle;

    @Column(length = 2048)
    private String postingDescription;

    @OneToMany(mappedBy = "jobPosting")
    private List<JobPostingSkill> jobPostingSkills;

    @OneToMany(mappedBy = "jobPosting")
    private List<JobPostingApplicant> jobPostingApplicants;
}
