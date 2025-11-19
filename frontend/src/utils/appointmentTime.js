export const slotToDate = (isoDate, slot) => {
  if (!isoDate || !slot) return null;
  try {
    const [time, modifier] = slot.split(" ");
    if (!time || !modifier) return new Date(isoDate);
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
    const normalizedHours = hours.toString().padStart(2, "0");
    const normalizedMinutes = Number.isNaN(minutes) ? "00" : minutes.toString().padStart(2, "0");
    return new Date(`${isoDate}T${normalizedHours}:${normalizedMinutes}:00`);
  } catch (err) {
    console.warn("Failed to parse appointment date", err);
    return new Date(isoDate);
  }
};

export const formatAppointmentDateTime = (isoDate, slot, locale = "en-IN") => {
  const parsed = slotToDate(isoDate, slot);
  if (!parsed || Number.isNaN(parsed.getTime())) return "Schedule pending";
  return parsed.toLocaleString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};


