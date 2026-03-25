package com.nexu.Email;


import com.nexu.Places.domain.Places;
import com.nexu.Plans.domain.Plans;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendWelcomeEmail(String to) {
        Context context = new Context();
        context.setVariable("usuario", to);
        context.setVariable("imgWelcome", "imgWelcome1");

        String htmlContent = templateEngine.process("welcomeEmail", context);

        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Bienvenido a NexU");
            helper.setText(htmlContent, true);

            // Cargar y adjuntar imagen como recurso embebido
            ClassPathResource image = new ClassPathResource("static/welcome.jpg");
            helper.addInline("imgWelcome1", image);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo de bienvenida", e);
        }
    }

    public void sendConfirmationRide(String email, Plans plan) {
        Context context = new Context();
        context.setVariable("usuario", email);
        context.setVariable("planNombre", plan.getName());
        Set<Places> places = plan.getPlaces();

        List<String> nombres = places.stream()
                .map(Places::getName)
                .collect(Collectors.toList());

        context.setVariable("lugares", nombres);


        String htmlContent = templateEngine.process("createdPlan", context);

        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("Tu plan de viaje ha sido confirmado");
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo de confirmación de plan", e);
        }
    }

    public void sendAccountDeletionEmail(String to) {
        Context context = new Context();
        context.setVariable("usuario", to);
        context.setVariable("imgBye", "imgDelete");

        String htmlContent = templateEngine.process("accountDeletedEmail", context);

        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Tu cuenta ha sido eliminada");
            helper.setText(htmlContent, true);

            ClassPathResource image = new ClassPathResource("static/bye.jpg");
            helper.addInline("imgDelete", image);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo de eliminación de cuenta", e);
        }
    }


}
