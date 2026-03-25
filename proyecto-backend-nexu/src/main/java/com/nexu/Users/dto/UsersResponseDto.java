package com.nexu.Users.dto;

import com.nexu.Users.domain.UserRole;
import com.nexu.Users.domain.UserStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class UsersResponseDto {

    private Long id;

    private String email;

    private String name;

    private UserStatus status;

    private UserRole role;

}