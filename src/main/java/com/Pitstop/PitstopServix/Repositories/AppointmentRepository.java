package com.Pitstop.PitstopServix.Repositories;

import com.Pitstop.PitstopServix.Entity.Appointment;
import com.Pitstop.PitstopServix.Entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findAllByStatusOrderByAppointmentDateAscTimeSlotAsc(AppointmentStatus status);
    List<Appointment> findAllByOrderByAppointmentDateAscTimeSlotAsc();
}


