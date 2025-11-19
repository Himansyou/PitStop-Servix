package com.Pitstop.PitstopServix.Services;

import com.Pitstop.PitstopServix.Entity.Appointment;
import com.Pitstop.PitstopServix.Entity.AppointmentStatus;
import com.Pitstop.PitstopServix.Entity.Garage;
import com.Pitstop.PitstopServix.Entity.User;
import com.Pitstop.PitstopServix.Repositories.AppointmentRepository;
import com.Pitstop.PitstopServix.Repositories.GarageRepository;
import com.Pitstop.PitstopServix.Repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final GarageRepository garageRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              GarageRepository garageRepository,
                              UserRepository userRepository,
                              EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.garageRepository = garageRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Appointment createAppointment(Long garageId,
                                         Long customerId,
                                         String serviceType,
                                         String timeSlot,
                                         LocalDate appointmentDate,
                                         String notes,
                                         String contactPhone) {
        Garage garage = garageRepository.findById(garageId)
                .orElseThrow(() -> new EntityNotFoundException("Garage not found"));
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        Appointment appointment = new Appointment();
        appointment.setGarage(garage);
        appointment.setCustomer(customer);
        appointment.setServiceType(serviceType);
        appointment.setTimeSlot(timeSlot);
        appointment.setAppointmentDate(appointmentDate);
        appointment.setNotes(notes);
        appointment.setContactPhone(contactPhone);
        appointment.setStatus(AppointmentStatus.PENDING);

        return appointmentRepository.save(appointment);
    }

    @Transactional(readOnly = true)
    public List<Appointment> listAppointments(AppointmentStatus status) {
        if (status != null) {
            return appointmentRepository.findAllByStatusOrderByAppointmentDateAscTimeSlotAsc(status);
        }
        return appointmentRepository.findAllByOrderByAppointmentDateAscTimeSlotAsc();
    }

    @Transactional
    public AppointmentUpdateResult updateStatus(Long appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));
        appointment.setStatus(status);
        Appointment saved = appointmentRepository.save(appointment);

        boolean notificationSent = false;
        if (status == AppointmentStatus.CONFIRMED) {
            notificationSent = emailService.sendAppointmentConfirmation(saved);
            if (notificationSent) {
                saved.setLastNotificationSentAt(Instant.now());
                saved.setLastNotificationType("CONFIRMED_EMAIL");
                saved = appointmentRepository.save(saved);
            }
        }
        return new AppointmentUpdateResult(saved, notificationSent);
    }

    public record AppointmentUpdateResult(Appointment appointment, boolean notificationSent) {
    }
}


