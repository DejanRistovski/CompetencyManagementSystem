package org.example.competencymanagementsystem.repository;

import org.example.competencymanagementsystem.model.JobPostingApplicant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobPostingApplicantRepository extends JpaRepository<JobPostingApplicant, Long> {
}
