const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'hotel_booking'
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API: Lấy danh sách phòng
app.get('/api/rooms', (req, res) => {
  db.query('SELECT * FROM rooms', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// API: Lấy danh sách khách hàng
app.get('/api/customers', (req, res) => {
  db.query('SELECT * FROM customers', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// API: Lấy danh sách lịch đặt phòng
app.get('/api/bookings', (req, res) => {
  db.query('SELECT * FROM bookings', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// API: Tổng hợp dữ liệu hiển thị dashboard
app.get('/api/dashboard', (req, res) => {
  const query = `
    SELECT 
      r.room_id, r.room_number, r.room_type, r.description,
      b.booking_id, DATE_FORMAT(b.check_in_date, '%Y-%m-%d') as check_in_date, DATE_FORMAT(b.check_out_date, '%Y-%m-%d') as check_out_date, b.status,
      c.customer_id, c.full_name, c.phone_number
    FROM rooms r
    LEFT JOIN bookings b ON r.room_id = b.room_id
    LEFT JOIN customers c ON b.customer_id = c.customer_id
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const dashboardData = results.reduce((acc, row) => {
      let room = acc.find(r => r.room_id === row.room_id);
      if (!room) {
        room = {
          room_id: row.room_id,
          room_number: row.room_number,
          room_type: row.room_type,
          description: row.description,
          bookings: []
        };
        acc.push(room);
      }
      if (row.booking_id) {
        room.bookings.push({
          booking_id: row.booking_id,
          check_in_date: row.check_in_date,
          check_out_date: row.check_out_date,
          status: row.status,
          customer: {
            customer_id: row.customer_id,
            full_name: row.full_name,
            phone_number: row.phone_number
          }
        });
      }
      return acc;
    }, []);
    
    res.json(dashboardData);
  });
});

// API: Thêm booking mới (Khách hàng đặt phòng)
app.post('/api/bookings', (req, res) => {
  const { room_id, full_name, phone_number, check_in_date, check_out_date } = req.body;
  
  // 1. Lưu khách hàng mới
  db.query('INSERT INTO customers (full_name, phone_number) VALUES (?, ?)', [full_name, phone_number], (err, customerResult) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const customer_id = customerResult.insertId;
    // 2. Tạo booking
    db.query('INSERT INTO bookings (room_id, customer_id, check_in_date, check_out_date, status) VALUES (?, ?, ?, ?, "Booked")', 
      [room_id, customer_id, check_in_date, check_out_date], 
      (err, bookingResult) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Booking successful!' });
    });
  });
});

// API: Cập nhật trạng thái booking (Lễ tân check-in)
app.put('/api/bookings/:id/status', (req, res) => {
  const { status } = req.body;
  db.query('UPDATE bookings SET status = ? WHERE booking_id = ?', [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Status updated' });
  });
});

// API: Xóa booking (Quản lý hủy hoặc Check-out)
app.delete('/api/bookings/:id', (req, res) => {
  db.query('DELETE FROM bookings WHERE booking_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Booking deleted' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
