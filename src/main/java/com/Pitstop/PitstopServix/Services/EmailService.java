package com.Pitstop.PitstopServix.Services;

import com.Pitstop.PitstopServix.Entity.Appointment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("EEEE, MMM d", Locale.ENGLISH);

    private final JavaMailSender mailSender;
    private final String defaultFrom;

    public EmailService(JavaMailSender mailSender,
                        @Value("${spring.mail.username:no-reply@pitstopservix.com}") String defaultFrom) {
        this.mailSender = mailSender;
        this.defaultFrom = defaultFrom;
    }

    public boolean sendAppointmentConfirmation(Appointment appointment) {
        String to = appointment.getCustomer() != null ? appointment.getCustomer().getEmail() : null;
        if (to == null || to.isBlank()) {
            log.warn("Skipping email notification, customer email missing for appointment {}", appointment.getId());
            return false;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setFrom(defaultFrom);
            message.setSubject("Your PitStop Servix appointment is confirmed");
            String body = buildBody(appointment);
            message.setText(body);
            mailSender.send(message);
            return true;
        } catch (Exception ex) {
            log.error("Failed to send confirmation email for appointment {}", appointment.getId(), ex);
            return false;
        }
    }

    private String buildBody(Appointment appointment) {
        String customerName = appointment.getCustomer() != null ? appointment.getCustomer().getName() : "Customer";
        String garageName = appointment.getGarage() != null ? appointment.getGarage().getGarageName() : "your selected garage";
        String scheduleDate = appointment.getAppointmentDate() != null
                ? appointment.getAppointmentDate().format(DATE_FORMATTER)
                : "your scheduled date";
        String schedule = appointment.getTimeSlot() != null
                ? scheduleDate + " at " + appointment.getTimeSlot()
                : scheduleDate;

        return """
                Hi %s,

                Great news! Your PitStop Servix appointment with %s has been confirmed.

                • Service: %s
                • Schedule: %s
                • Notes: %s

                Need to reschedule? Reply to this email or reach out from the app anytime.

                See you soon,
                Team PitStop Servix
                """.formatted(
                customerName,
                garageName,
                appointment.getServiceType() != null ? appointment.getServiceType() : "General Service",
                schedule,
                appointment.getNotes() != null ? appointment.getNotes() : "N/A"
        );
    }
}


