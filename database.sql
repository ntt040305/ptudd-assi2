CREATE DATABASE IF NOT EXISTS hotel_booking;
USE hotel_booking;

-- Bảng rooms: Lưu thông tin phòng
CREATE TABLE rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    description TEXT
);

-- Bảng customers: Lưu thông tin khách hàng
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(100)
);

-- Bảng bookings: Lưu thông tin lịch đặt phòng, liên kết với rooms và customers
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    customer_id INT,
    check_in_date DATE,
    check_out_date DATE,
    status ENUM('Available', 'Booked', 'Checked-in') NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- DỮ LIỆU MẪU (SEED DATA)
INSERT INTO rooms (room_number, room_type, description) VALUES
('101', 'standard', 'Standard room with basic amenities'),
('102', 'standard', 'Standard room with city view'),
('201', 'deluxe', 'Deluxe room with king size bed'),
('301', 'suite', 'Luxury suite with ocean view');

INSERT INTO customers (full_name, phone_number, email) VALUES
('Nguyen Van A', '0901234567', 'a@example.com'),
('Tran Thi B', '0912345678', 'b@example.com'),
('Le Van C', '0923456789', 'c@example.com');

INSERT INTO bookings (room_id, customer_id, check_in_date, check_out_date, status) VALUES
(1, 1, '2026-05-01', '2026-05-03', 'Booked'),
(2, 2, '2026-04-30', '2026-05-05', 'Checked-in'),
(3, 3, '2026-05-05', '2026-05-07', 'Booked');
