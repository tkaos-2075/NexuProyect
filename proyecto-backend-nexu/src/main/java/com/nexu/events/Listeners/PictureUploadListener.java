package com.nexu.events.Listeners;

import com.nexu.Pictures.domain.MediaStorageService;
import com.nexu.events.PictureUploadEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PictureUploadListener {

    private final MediaStorageService mediaStorageService;

    @EventListener
    public void handlePictureUploadEvent(PictureUploadEvent event) {
        try {
            mediaStorageService.handleUploadAndPersist(event.getPicture(), event.getFile());
            log.info("✅ Imagen procesada y actualizada correctamente.");
        } catch (Exception e) {
            log.error("❌ Error en MediaStorageService al manejar la imagen", e);
        }
    }
}
