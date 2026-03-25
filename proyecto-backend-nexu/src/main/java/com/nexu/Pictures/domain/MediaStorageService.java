package com.nexu.Pictures.domain;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.nexu.Pictures.infrastructure.PicturesRepository;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaStorageService {

    private final AmazonS3 s3Client;
    private final PicturesRepository picturesRepository;

    @Value("${amazonS3.bucketName}")
    private String bucketName;

    /**
     * Maneja la carga a S3 y persiste la entidad Pictures actualizada con la URL.
     */
    public void handleUploadAndPersist(Pictures picture, MultipartFile multipartFile) throws FileUploadException {
        String url = uploadFileToS3(multipartFile);
        picture.setUrl(url);
        picturesRepository.save(picture); // Actualiza la entidad con la URL
    }

    /**
     * Sube el archivo a S3 y devuelve la URL pública.
     */
    public String uploadFileToS3(MultipartFile multipartFile) throws FileUploadException {
        try {
            String todayDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            String uniqueId = UUID.randomUUID().toString();
            String filePath = todayDate + "_" + uniqueId + "_" + multipartFile.getOriginalFilename();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(multipartFile.getContentType());
            metadata.setContentLength(multipartFile.getSize());
            System.out.println("Subiendo archivo: " + multipartFile.getOriginalFilename() +
                    ", tamaño: " + multipartFile.getSize() +
                    ", tipo: " + multipartFile.getContentType());
            s3Client.putObject(bucketName, filePath, multipartFile.getInputStream(), metadata);

            return s3Client.getUrl(bucketName, filePath).toString();

        } catch (IOException e) {
            throw new FileUploadException("Error uploading file to S3: " + e.getMessage());
        }
    }
}
