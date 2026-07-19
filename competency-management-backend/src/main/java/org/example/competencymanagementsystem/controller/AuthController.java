package org.example.competencymanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.competencymanagementsystem.config.UserAuthProvider;
import org.example.competencymanagementsystem.model.dto.CredentialsDto;
import org.example.competencymanagementsystem.model.dto.SignUpDto;
import org.example.competencymanagementsystem.model.dto.UserDto;
import org.example.competencymanagementsystem.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserAuthProvider userAuthProvider;

    @PostMapping("/login")
    public UserDto login(@RequestBody CredentialsDto credentialsDto) {
        UserDto userDto = userService.login(credentialsDto);
        userDto.setToken(userAuthProvider.createToken(userDto));
        return userDto;
    }

    @PostMapping("/register")
    public UserDto register(@RequestBody SignUpDto signUpDto) {
        UserDto userDto = userService.register(signUpDto);
        userDto.setToken(userAuthProvider.createToken(userDto));
        return userDto;
    }
}
