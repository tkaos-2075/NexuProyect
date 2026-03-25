package com.nexu.events;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class AccountDeletionEmailEvent extends ApplicationEvent {
    private final String email;

    public AccountDeletionEmailEvent(String email) {
        super(email);
        this.email = email;
    }
}
