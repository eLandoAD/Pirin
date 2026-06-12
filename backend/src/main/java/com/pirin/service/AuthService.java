package com.pirin.service;

import com.pirin.dto.ForgotPasswordRequest;
import com.pirin.dto.LoginRequest;
import com.pirin.dto.LoginResponse;
import com.pirin.dto.MessageResponse;
import com.pirin.dto.PasswordChangeRequest;
import com.pirin.dto.RegisterRequest;
import com.pirin.dto.ResetPasswordRequest;
import com.pirin.entity.EmailVerificationToken;
import com.pirin.entity.PasswordResetToken;
import com.pirin.entity.User;
import com.pirin.repository.EmailVerificationTokenRepository;
import com.pirin.repository.PasswordResetTokenRepository;
import com.pirin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository emailTokenRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public AuthService(
            UserRepository userRepository,
            EmailVerificationTokenRepository emailTokenRepository,
            PasswordResetTokenRepository resetTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.emailTokenRepository = emailTokenRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.mailSender = mailSender;
    }

    public MessageResponse register(RegisterRequest request) {
        if (request.username() == null || request.username().isBlank())
            throw new RuntimeException("Username obbligatorio.");
        if (request.email() == null || request.email().isBlank())
            throw new RuntimeException("Email obbligatoria.");
        if (request.password() == null || request.password().length() < 8)
            throw new RuntimeException("La password deve avere almeno 8 caratteri.");
        if (userRepository.existsByUsername(request.username()))
            throw new RuntimeException("Username già in uso.");
        if (userRepository.existsByEmail(request.email()))
            throw new RuntimeException("Email già registrata.");

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setEncryptedDek(request.encryptedDek());
        user.setDekSalt(request.dekSalt());
        user.setDekIv(request.dekIv());
        user.setEnabled(false);
        userRepository.save(user);

        EmailVerificationToken token = new EmailVerificationToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(LocalDateTime.now().plusHours(24));
        emailTokenRepository.save(token);

        String verifyLink = frontendUrl + "/verify?token=" + token.getToken();
        sendEmail(user.getEmail(), "Verifica il tuo account SecureVault",
                "Clicca il link per verificare il tuo account:\n\n" + verifyLink +
                        "\n\nIl link scade tra 24 ore.");

        return new MessageResponse("Account creato. Controlla la tua email per verificarlo.");
    }

    public MessageResponse verifyEmail(String tokenValue) {
        EmailVerificationToken token = emailTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new RuntimeException("Token non valido."));
        if (token.getUsedAt() != null)
            throw new RuntimeException("Token già usato.");
        if (token.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new RuntimeException("Token scaduto.");

        User user = token.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        token.setUsedAt(LocalDateTime.now());
        emailTokenRepository.save(token);

        return new MessageResponse("Email verificata con successo.");
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Credenziali non valide."));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash()))
            throw new RuntimeException("Credenziali non valide.");
        if (!user.isEnabled())
            throw new RuntimeException("Devi verificare la tua email prima di accedere.");

        String jwt = jwtService.generateToken(user);

        return new LoginResponse(
                jwt,
                user.getUsername(),
                user.getEmail(),
                user.getEncryptedDek(),
                user.getDekSalt(),
                user.getDekIv());
    }

    public MessageResponse logout() {
        return new MessageResponse("Logout effettuato.");
    }

    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            PasswordResetToken token = new PasswordResetToken();
            token.setUser(user);
            token.setToken(UUID.randomUUID().toString());
            token.setExpiresAt(LocalDateTime.now().plusMinutes(30));
            resetTokenRepository.save(token);

            String resetLink = frontendUrl + "/reset-password?token=" + token.getToken();
            sendEmail(user.getEmail(), "Reset password SecureVault",
                    "Clicca il link per reimpostare la tua password:\n\n" + resetLink +
                            "\n\nIl link scade tra 30 minuti.");
        });
        return new MessageResponse("Se l'email è registrata, riceverai un link per il reset.");
    }

    public MessageResponse resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = resetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new RuntimeException("Token non valido."));
        if (token.getUsedAt() != null)
            throw new RuntimeException("Token già usato.");
        if (token.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new RuntimeException("Token scaduto.");
        if (request.newPassword() == null || request.newPassword().length() < 8)
            throw new RuntimeException("La password deve avere almeno 8 caratteri.");

        User user = token.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        token.setUsedAt(LocalDateTime.now());
        resetTokenRepository.save(token);

        return new MessageResponse(
                "Password aggiornata. Nota: i file cifrati precedentemente non sono più accessibili.");
    }

    public MessageResponse changePassword(User currentUser, PasswordChangeRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Utente non trovato."));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash()))
            throw new RuntimeException("Password attuale non corretta.");
        if (request.getNewPassword() == null || request.getNewPassword().length() < 8)
            throw new RuntimeException("La nuova password deve avere almeno 8 caratteri.");

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));

        if (request.getNewEncryptedDek() != null && !request.getNewEncryptedDek().isBlank())
            user.setEncryptedDek(request.getNewEncryptedDek());
        if (request.getNewDekIv() != null && !request.getNewDekIv().isBlank())
            user.setDekIv(request.getNewDekIv());

        userRepository.save(user);
        return new MessageResponse("Password aggiornata con successo.");
    }

    private void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Errore invio email: " + e.getMessage());
        }
    }
}