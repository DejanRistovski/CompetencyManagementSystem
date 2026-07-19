package org.example.competencymanagementsystem.model.mappers;

import org.example.competencymanagementsystem.model.User;
import org.example.competencymanagementsystem.model.UserSkill;
import org.example.competencymanagementsystem.model.dto.SignUpDto;
import org.example.competencymanagementsystem.model.dto.UserDto;
import org.example.competencymanagementsystem.model.dto.UserSkillDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring", uses = {SkillMapper.class})
public abstract class UserMapper {

    @Autowired
    protected SkillMapper skillMapper;

    @Mapping(target = "skills", expression = "java(userSkillsToUserSkillsDto(user.getUserSkills()))")
    public abstract UserDto userToUserDto(User user);
    public abstract User signUpToUser(SignUpDto signUpDto);

    protected List<UserSkillDTO> userSkillsToUserSkillsDto (List<UserSkill> userSkills) {
        if (userSkills == null)
            return new ArrayList<>();

        return userSkills.stream().map(userSkill ->
            new UserSkillDTO(
                    userSkill.getId(),
                    skillMapper.skillToSkillDto(userSkill.getSkillLevel().getSkill(), userSkill.getSkillLevel().getId())
            )
        ).toList();
    }
}
