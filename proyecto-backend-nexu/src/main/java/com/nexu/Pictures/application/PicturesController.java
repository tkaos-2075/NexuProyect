package com.nexu.Pictures.application;

import com.nexu.Pictures.domain.PicturesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/pictures")
@RequiredArgsConstructor
public class PicturesController {

    private final PicturesService picturesService;

    @PostMapping("/place")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> uploadPicturesToPlace(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("placeId") Long placeId
    ) {
        picturesService.handlePictureUploadForPlace(files, placeId);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/review")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> uploadPicturesToReview(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("reviewId") Long reviewId
    ) {
        picturesService.handlePictureUploadForReview(files, reviewId);
        return ResponseEntity.accepted().build();
    }

    @PreAuthorize("hasRole('VIEWER')")
    @GetMapping("/place")
    public ResponseEntity<List<String>> getPicturesByPlace(@RequestParam("placeId") Long placeId) {
        List<String> urls = picturesService.getPictureUrlsByPlaceId(placeId);
        return ResponseEntity.ok(urls);
    }

    @PreAuthorize("hasRole('VIEWER')")
    @GetMapping("/review")
    public ResponseEntity<List<String>> getPicturesByReview(@RequestParam("reviewId") Long reviewId) {
        List<String> urls = picturesService.getPictureUrlsByReviewId(reviewId);
        return ResponseEntity.ok(urls);
    }


}
