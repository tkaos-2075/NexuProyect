package com.nexu.events.Listeners;

import com.nexu.events.AccountDeletionEmailEvent;
import com.nexu.Email.EmailService;
import com.nexu.events.PlanCreationEmailEvent;
import com.nexu.events.WelcomeEmailEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailListener {
    private final EmailService emailService;

    @EventListener
    @Async
    public void handleWelcomeEmailEvent(WelcomeEmailEvent event) {
        emailService.sendWelcomeEmail(event.getEmail());
    }

    @EventListener
    @Async
    public void handlePlanCreationEmailEvent(PlanCreationEmailEvent event) {
        emailService.sendConfirmationRide(event.getEmail(), event.getPlan());
    }
    @EventListener
    @Async
    public void handleAccountDeletionEmailEvent(AccountDeletionEmailEvent event) {
        emailService.sendAccountDeletionEmail(event.getEmail());
    }

}