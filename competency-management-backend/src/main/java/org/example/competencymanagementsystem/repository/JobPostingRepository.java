package org.example.competencymanagementsystem.repository;

import org.example.competencymanagementsystem.model.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
}
