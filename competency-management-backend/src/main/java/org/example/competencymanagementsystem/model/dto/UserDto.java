package org.example.competencymanagementsystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.competencymanagementsystem.model.enums.UserRole;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String token;
    private String firstName;
    private String lastName;
    private String email;
    private String jobTitle;
    private String location;
    private String phoneNumber;
    private String description;
    private String photoUrl;
    private UserRole userRole;

    private List<UserSkillDTO> skills;
}
