package com.nexu.events;

import com.nexu.Plans.domain.Plans;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class PlanCreationEmailEvent extends ApplicationEvent {
    private final String email;
    private final Plans plan;

    public PlanCreationEmailEvent(String email, Plans plan) {
        super(email);
        this.email = email;
        this.plan = plan;
    }
}
