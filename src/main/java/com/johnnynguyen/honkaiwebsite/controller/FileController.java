package com.johnnynguyen.honkaiwebsite.controller;

import com.johnnynguyen.honkaiwebsite.service.FileStorageService;
import com.johnnynguyen.honkaiwebsite.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private PostService postService;

    // Everyone whose is authenticated can use these APIs.

    // Get any files that is already uploaded, as long as it matches fileName.
    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> getUploadedFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        }
        catch (IOException e) {
            // TODO: Logging error here.
            e.printStackTrace();
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        // Allowed file types of an image.
        final List<String> allowMimeTypes = List.of("image/jpeg", "image/jpg", "image/png", "image/webp");
        String fileType = file.getContentType();
        if (!allowMimeTypes.contains(fileType) || fileType == null) {
            return ResponseEntity.badRequest().body("Unsupported file type");
        }

        String fileName = fileStorageService.storeFile(file);
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/files/")
                .path(fileName)
                .toUriString();

        return ResponseEntity.ok(fileDownloadUri);
    }

    // Set images to specific postId.
    // TODO: In React, you would use two APIs responses.
    @PutMapping("/post/{postId}")
    public ResponseEntity<Void> addImageToPost(@PathVariable Long postId, @RequestBody Map<String, String> file) {
        if (!postService.getPostById(postId).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        // Using the matching name from Post JSON.
        String imageURL = file.get("imageURL");
        if (imageURL == null || imageURL.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        postService.addImageToPost(postId, imageURL);
        return ResponseEntity.ok().build();
    }
}
