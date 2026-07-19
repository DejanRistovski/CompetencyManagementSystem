package org.example.competencymanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.competencymanagementsystem.model.dto.SkillDTO;
import org.example.competencymanagementsystem.model.dto.UserDto;
import org.example.competencymanagementsystem.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public UserDto fetchLoggedInUser(){
        return userService.fetchLoggedInUser();
    }

    @GetMapping("/{userId}")
    public UserDto fetchById(@PathVariable Long userId){
        return userService.fetchById(userId);
    }

    @GetMapping("/all")
    public List<UserDto> fetchAll(){
        return userService.fetchAllAuthenticated();
    }

    @PostMapping(value = "/{userId}/update-skills")
    public UserDto updateUserSkills(@PathVariable Long userId, @RequestBody List<Long> skillLevelIds) {
        return userService.updateUserSkills(userId, skillLevelIds);
    }

    @PostMapping(value = "/{userId}/assign-skill")
    public UserDto saveAndAssignUserSkill(@PathVariable Long userId, @RequestBody SkillDTO skillDTO) {
        return userService.saveAndAssignUserSkill(userId, skillDTO);
    }

    @DeleteMapping(value = "/{userSkillId}")
    public Long deleteUserSkill(@PathVariable Long userSkillId) {
        return userService.deleteUserSkill(userSkillId);
    }
}
