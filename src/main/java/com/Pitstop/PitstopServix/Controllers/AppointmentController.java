package com.Pitstop.PitstopServix.Controllers;

import com.Pitstop.PitstopServix.Entity.Appointment;
import com.Pitstop.PitstopServix.Entity.AppointmentStatus;
import com.Pitstop.PitstopServix.Entity.CustomerProfile;
import com.Pitstop.PitstopServix.Services.AppointmentService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(@RequestBody @Valid CreateAppointmentRequest request) {
        LocalDate appointmentDate;
        try {
            appointmentDate = LocalDate.parse(request.appointmentDate());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid appointmentDate. Use ISO format (yyyy-MM-dd).");
        }
        try {
            Appointment appointment = appointmentService.createAppointment(
                    request.garageId(),
                    request.customerId(),
                    request.serviceType(),
                    request.timeSlot(),
                    appointmentDate,
                    request.notes(),
                    request.contactPhone()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(AppointmentResponse.from(appointment));
        } catch (EntityNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAppointments(@RequestParam(value = "status", required = false) AppointmentStatus status) {
        List<AppointmentResponse> responses = appointmentService.listAppointments(status)
                .stream()
                .map(AppointmentResponse::from)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UpdateStatusResponse> updateStatus(@PathVariable Long id, @RequestBody @Valid UpdateStatusRequest request) {
        AppointmentStatus status;
        try {
            status = AppointmentStatus.valueOf(request.status().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported appointment status");
        }
        try {
            var result = appointmentService.updateStatus(id, status);
            return ResponseEntity.ok(new UpdateStatusResponse(AppointmentResponse.from(result.appointment()), result.notificationSent()));
        } catch (EntityNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    public record CreateAppointmentRequest(
            @NotNull Long garageId,
            @NotNull Long customerId,
            @NotBlank String serviceType,
            @NotBlank String timeSlot,
            @NotBlank String appointmentDate,
            String notes,
            String contactPhone
    ) {
    }

    public record UpdateStatusRequest(@NotBlank String status) {
    }

    public record AppointmentResponse(
            Long id,
            String serviceType,
            String timeSlot,
            LocalDate appointmentDate,
            AppointmentStatus status,
            String notes,
            ContactInfo customer,
            GarageInfo garage,
            NotificationInfo notification
    ) {
        public static AppointmentResponse from(Appointment appointment) {
            return new AppointmentResponse(
                    appointment.getId(),
                    appointment.getServiceType(),
                    appointment.getTimeSlot(),
                    appointment.getAppointmentDate(),
                    appointment.getStatus(),
                    appointment.getNotes(),
                    ContactInfo.from(appointment),
                    GarageInfo.from(appointment),
                    NotificationInfo.from(appointment)
            );
        }
    }

    public record ContactInfo(Long id, String name, String email, String phone, String vehicleNumber) {
        static ContactInfo from(Appointment appointment) {
            var customer = appointment.getCustomer();
            CustomerProfile profile = customer.getCustomerProfile();
            return new ContactInfo(
                    customer.getId(),
                    customer.getName(),
                    customer.getEmail(),
                    Objects.requireNonNullElse(appointment.getContactPhone(), profile != null ? profile.getPhone() : null),
                    profile != null ? profile.getVehicleNumber() : null
            );
        }
    }

    public record GarageInfo(Long id, String name, String address, String ownerName) {
        static GarageInfo from(Appointment appointment) {
            var garage = appointment.getGarage();
            return new GarageInfo(
                    garage.getId(),
                    garage.getGarageName(),
                    garage.getGarageAddress(),
                    garage.getOwner() != null ? garage.getOwner().getName() : null
            );
        }
    }

    public record NotificationInfo(Instant lastSentAt, String type) {
        static NotificationInfo from(Appointment appointment) {
            if (appointment.getLastNotificationSentAt() == null) {
                return null;
            }
            return new NotificationInfo(appointment.getLastNotificationSentAt(), appointment.getLastNotificationType());
        }
    }

    public record UpdateStatusResponse(AppointmentResponse appointment, boolean notificationSent) {
    }
}


