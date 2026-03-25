package com.nexu.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import org.springframework.web.multipart.MultipartFile;
import com.nexu.Pictures.domain.Pictures;

@Getter
public class PictureUploadEvent extends ApplicationEvent {
    private final Pictures picture;
    private final MultipartFile file;

    public PictureUploadEvent(Pictures picture, MultipartFile file) {
        super(picture);  // El 'source' del evento será la entidad picture
        this.picture = picture;
        this.file = file;
    }
}
