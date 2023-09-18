module.exports = {
  invalid_request: "Invalid Request",
  device_not_exists: "Device doesn not exists",
  invalid_hotel_email: "Provided email does not associated with any hotel",
  device_not_associated_to_hotel:
    "Device is not associated with provided hotel",
  invalid_credentials: "Invalid Credentials.",
  unauthorized_access: "Unauthorized access",
  internal_server_error: "Internal server error, please contact admin.",
  rooms: {
    create_room: "A new QR has been assigned to the location.",
    room_number_exists: "Location is already assigned.",
    invalid_room: "Invalid Location",
    update_room: "A new QR has been saved for the location.",
    qrcode_removed: "QR Code detached from location successfully",
    room_delete: "The QR assigned to the location has been deleted.",
    qr_code_generated: "A new QR has been assigned to the location.",
    qr_code_limit_reached: "Cannot create qr codes more than the allowed limit",
  },
  booking: {
    create: "Booking created successfully",
    request_issue:
      "There is something wrong with the request, please talk to the reception",
    cancelled: "Booking cancelled successfully",
    mti_taxi_not_available: "Taxi is not available with this vendor.",
    mti_maxi_not_available: "Maxi is not available with this vendor.",
  },
  device: {
    key_generated: "Key generated successfully",
  },
  admin: {
    booking: {
      booking_deleted: "Booking deleted successfully",
    },
    profile_updated: "Profile updated successfully",
    password_changed: "Password changed successfully",
    wrong_current_password: "Provided current password is wrong",
    password_change_missmatch:
      "New password and confirm new password does not match",
    reset_password_request_expired: "Reset password request expired",
  },
  merchant: {
    // booking: {
    //   booking_deleted: "Booking deleted successfully",
    // },
    profile_updated: "Profile updated successfully",
    password_changed: "Password changed successfully",
    wrong_current_password: "Provided current password is wrong",
    password_change_missmatch:
      "New password and confirm new password does not match",
    reset_password_request_expired: "Reset password request expired",
    cusinie_exists: "Cusinie already exists",
    cusinie_add: "Cusinie added successfully",
    cusinie_updated: "Cusinie updated successfully",
    cusinie_delete: "Cusinie deleted successfully",
    cusinie_status:  "Status changed successfully",
  },
  taxi: {
    qrcodereqeust: {
      create: "QR Code request has been sent to admin for approval",
      approved: "QR Code request had been approved successfully",
      reject: "QR Code request had been rejected successfully",
    },
  },
  logout: "Logged Out Successfully",
  qr_code_pdf_sent_successfully: "QR list pdf sent successfully.",
  mti_fleet_doesnot_exist:
    "Fleet does not exist on MTI with provided phone number, please contact admin.",
  webapp_booking_limit_reached: "You can only place two bookings in a day.",
  webapp_out_of_venue_booking: "Cannot place booking outside the venue.",
};
