package com.Dayflow.service;

import com.Dayflow.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.mail.from:dayflow@localhost}")
    private String mailFrom;

    public void sendVerificationEmail(User user, String token) {
        String verificationLink = baseUrl + "/verify-email?token=" + token;

        log.info("========================================");
        log.info("EMAIL VERIFICATION LINK for {}: {}", user.getEmail(), verificationLink);
        log.info("========================================");

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(user.getEmail());
            message.setSubject("Dayflow - Verify Your Email");
            message.setText(
                "Hello " + user.getFirstName() + ",\n\n"
                + "Please verify your email by clicking the link below:\n"
                + verificationLink + "\n\n"
                + "Your Login ID is: " + user.getLoginId() + "\n\n"
                + "This link expires in 24 hours.\n\n"
                + "Regards,\nDayflow Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Could not send email. Use the verification link logged above. Reason: {}", e.getMessage());
        }
    }

    public void sendEmployeeCredentials(User user, String temporaryPassword) {
        log.info("========================================");
        log.info("EMPLOYEE CREDENTIALS for {}: Login ID={}, Temporary password={}",
            user.getEmail(), user.getLoginId(), temporaryPassword);
        log.info("========================================");

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Dayflow - Your Employee Account");
            message.setText(
                "Hello " + user.getFirstName() + ",\n\n"
                + "An employee account has been created for you.\n\n"
                + "Login ID: " + user.getLoginId() + "\n"
                + "Temporary password: " + temporaryPassword + "\n\n"
                + "Please change your password after logging in.\n\n"
                + "Regards,\nDayflow Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Could not send employee credentials email. Use the credentials logged above. Reason: {}", e.getMessage());
        }
    }
}