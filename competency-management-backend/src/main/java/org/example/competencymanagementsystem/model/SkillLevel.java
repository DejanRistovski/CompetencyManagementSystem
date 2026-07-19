package org.example.competencymanagementsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class SkillLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String expectation;
    private Integer levelOrder;

    @OneToMany(mappedBy = "skillLevel")
    private List<UserSkill> userSkills;

    @OneToMany(mappedBy = "skillLevel")
    private List<JobPostingSkill> jobPostingSkills;

    @ManyToOne
    @JoinColumn(name = "skill_id")
    private Skill skill;
}
