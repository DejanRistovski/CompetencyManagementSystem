package org.example.competencymanagementsystem.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.competencymanagementsystem.model.*;
import org.example.competencymanagementsystem.model.dto.*;
import org.example.competencymanagementsystem.model.mappers.UserMapper;
import org.example.competencymanagementsystem.model.exceptions.AppException;
import org.example.competencymanagementsystem.repository.SkillLevelRepository;
import org.example.competencymanagementsystem.repository.UserRepository;
import org.example.competencymanagementsystem.repository.UserSkillRepository;
import org.example.competencymanagementsystem.service.SkillService;
import org.example.competencymanagementsystem.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final SkillLevelRepository skillLevelRepository;
    private final UserSkillRepository userSkillRepository;
    private final SkillService skillService;

    @Override
    public List<UserDto> fetchAllAuthenticated() {
        return userRepository.findAllAuthenticated().stream().map(userMapper::userToUserDto).toList();
    }

    @Override
    public UserDto fetchById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return userMapper.userToUserDto(user);
    }

    @Override
    public UserDto login(CredentialsDto credentialsDto) {
        User user = userRepository.findByEmail(credentialsDto.email())
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()), user.getPassword())) {
            return userMapper.userToUserDto(user);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    @Override
    public UserDto register(SignUpDto signUpDto) {
        Optional<User> oUser = userRepository.findByEmail(signUpDto.email());

        if (oUser.isPresent()) {
            throw new AppException("Email already in use", HttpStatus.BAD_REQUEST);
        }

        User user = userMapper.signUpToUser(signUpDto);

        user.setPassword(passwordEncoder.encode(signUpDto.password()));
        User savedUser = userRepository.save(user);
        return userMapper.userToUserDto(savedUser);
    }

    @Override
    public UserDto fetchLoggedInUser() {
        UserDto userDto = (UserDto) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userMapper.userToUserDto(userRepository.findByEmail(userDto.getEmail()).orElseThrow());
    }

    @Override
    @Transactional
    public UserDto updateUserSkills(Long userId, List<Long> skillLevelIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User with id " + userId + " not found", HttpStatus.BAD_REQUEST));
        List<UserSkill> skillsToRemove = new ArrayList<>();
        List<UserSkill> skillsToAdd = new ArrayList<>();
        List<UserSkill> userSkills = user.getUserSkills();
        List<SkillLevel> skillLevels = skillLevelRepository.findAllById(skillLevelIds);
        for (SkillLevel lvl : skillLevels) {
            Optional<UserSkill> existingLvl = userSkills.stream()
                    .filter(usk -> usk.getSkillLevel().getSkill().getId().equals(lvl.getSkill().getId())
                            && usk.getSkillLevel().getLevelOrder() < lvl.getLevelOrder())
                    .findFirst();
            if (existingLvl.isPresent()) {
                skillsToRemove.add(existingLvl.get());
                skillsToAdd.add(new UserSkill(null, lvl, user));
                continue;
            }

            boolean newSkill = userSkills.stream().noneMatch(usk -> usk.getSkillLevel().getId().equals(lvl.getId()));
            if (newSkill) {
                skillsToAdd.add(new UserSkill(null, lvl, user));
            }
        }

        userSkills.forEach(skLvl -> {
            if (skillLevels.stream().noneMatch(lvl -> lvl.getId().equals(skLvl.getSkillLevel().getId())))
                skillsToRemove.add(skLvl);
        });
        userSkillRepository.deleteAll(skillsToRemove);
        List<UserSkill> savedSkills = userSkillRepository.saveAll(skillsToAdd);

        userSkills.removeAll(skillsToRemove);
        userSkills.addAll(savedSkills);
        return userMapper.userToUserDto(user);
    }

    @Override
    @Transactional
    public UserDto saveAndAssignUserSkill(Long userId, SkillDTO skillDTO) {
        SkillLevel skillLevel;
        if (skillDTO.id() == null) {
            SkillDTO newSkill = skillService.create(skillDTO);
            skillLevel = skillLevelRepository.findByNameAndSkillId(skillDTO.basedLevel(), newSkill.id())
                    .orElseThrow(() -> new AppException("Level with name " + skillDTO.basedLevel() + " not found", HttpStatus.BAD_REQUEST));
        }
        else {
            skillLevel = skillLevelRepository.findById(skillDTO.matchedLevelId())
                    .orElseThrow(() -> new AppException("Level with id " + skillDTO.matchedLevelId() + " not found", HttpStatus.BAD_REQUEST));
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User with id " + userId + " not found", HttpStatus.BAD_REQUEST));
        userSkillRepository.deleteByUserIdAndSkillId(user.getId(), skillLevel.getSkill().getId());
        UserSkill userSkill = userSkillRepository.save(new UserSkill(null, skillLevel, user));
        user.getUserSkills().add(userSkill);
        return userMapper.userToUserDto(user);
    }

    @Override
    public Long deleteUserSkill(Long userSkillId) {
        userSkillRepository.deleteById(userSkillId);
        return userSkillId;
    }
}
