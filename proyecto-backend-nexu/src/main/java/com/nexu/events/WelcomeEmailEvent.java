package com.nexu.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class WelcomeEmailEvent extends ApplicationEvent {
    private final String email;

    public WelcomeEmailEvent(String email) {
        super(email);
        this.email = email;
    }
}