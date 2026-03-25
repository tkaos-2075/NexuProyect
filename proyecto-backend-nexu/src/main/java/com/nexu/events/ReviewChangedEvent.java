package com.nexu.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ReviewChangedEvent extends ApplicationEvent {
    private final Long placeId;

    public ReviewChangedEvent(Object source, Long placeId) {
        super(source);
        this.placeId = placeId;
    }
}

