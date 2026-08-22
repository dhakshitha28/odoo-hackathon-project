package com.Dayflow.exception;

import com.Dayflow.dto.response.ApiResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.badRequest().body(
            ApiResponse.<Void>builder()
                .success(false)
                .message(ex.getMessage())
                .build()
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ApiResponse.<Void>builder()
                .success(false)
                .message(ex.getMessage())
                .build()
        );
    }

    @ExceptionHandler({ForbiddenException.class, AccessDeniedException.class})
    public ResponseEntity<ApiResponse<Void>> handleForbidden(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            ApiResponse.<Void>builder()
                .success(false)
                .message("User does not have permission")
                .build()
        );
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(
            ApiResponse.<Void>builder()
                .success(false)
                .message("Content-Type must be application/json. In Postman: Body → raw → JSON")
                .build()
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleMessageNotReadable(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(
            ApiResponse.<Void>builder()
                .success(false)
                .message("Invalid JSON body. Check your request format.")
                .build()
        );
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiResponse<Void>> handleConflict(ConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
            ApiResponse.<Void>builder()
                .success(false)
                .message(ex.getMessage())
                .build()
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException ex) {
        String message = "This email or login ID already exists. Please use different details.";

        if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("login_id")) {
            message = "Login ID already exists. Use a different name or restart the server to clear test data.";
        } else if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("email")) {
            message = "Email already registered. Please use a different email.";
        } else if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("employee")) {
            message = "Employee ID already exists. Please use a different Employee ID.";
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(
            ApiResponse.<Void>builder()
                .success(false)
                .message(message)
                .build()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        return ResponseEntity.badRequest().body(
            ApiResponse.<Map<String, String>>builder()
                .success(false)
                .message("Validation failed")
                .data(errors)
                .build()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ApiResponse.<Void>builder()
                .success(false)
                .message("Internal server error: " + ex.getMessage())
                .build()
        );
    }
}
