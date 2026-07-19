package org.example.competencymanagementsystem.service;

import org.example.competencymanagementsystem.model.dto.*;

import java.util.List;

public interface UserService {
    List<UserDto> fetchAllAuthenticated();
    UserDto fetchById(Long userId);
    UserDto login(CredentialsDto credentialsDto);
    UserDto register(SignUpDto signUpDto);
    UserDto fetchLoggedInUser();
    UserDto updateUserSkills(Long userId, List<Long> skills);
    UserDto saveAndAssignUserSkill(Long userId, SkillDTO skillDTO);
    Long deleteUserSkill(Long userSkillId);
}
