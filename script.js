class Room {
    constructor(number, capacity) {
      this.number = number;
      this.capacity = capacity;
      this.reservations = [];
    }
  
    isAvailable(date, startTime, duration) {
      for (let reservation of this.reservations) {
        if (reservation.date === date) {
          const reservedStart = new Date(`${date}T${reservation.startTime}`);
          const reservedEnd = new Date(reservedStart.getTime() + reservation.duration * 60 * 60 * 1000);
  
          const requestedStart = new Date(`${date}T${startTime}`);
          const requestedEnd = new Date(requestedStart.getTime() + duration * 60 * 60 * 1000);
  
          if ((requestedStart >= reservedStart && requestedStart < reservedEnd) ||
              (requestedEnd > reservedStart && requestedEnd <= reservedEnd)) {
            return false;
          }
        }
      }
      return true;
    }
  
    addReservation(reservation) {
      this.reservations.push(reservation);
    }
  }
  
  class Reservation {
    constructor(name, roomNumber, date, startTime, duration) {
      this.name = name;
      this.roomNumber = roomNumber;
      this.date = date;
      this.startTime = startTime;
      this.duration = duration;
    }
  }
  
  // Data ruangan contoh
  const rooms = [
    new Room(101, 30),
    new Room(102, 20),
    new Room(103, 25),
    new Room(104, 40),
    new Room(105, 35)
  ];
  
  // Inisialisasi daftar reservasi
  let reservations = [];

  
  // Fungsi untuk menampilkan daftar ruangan
function displayRooms() {
    const roomList = document.getElementById('room-list').getElementsByTagName('tbody')[0];
    roomList.innerHTML = '';
  
    rooms.forEach(room => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${room.number}</td>
        <td>${room.capacity}</td>
        <td>${room.reservations.length === 0 ? 'Tersedia' : 'Tidak Tersedia'}</td>
      `;
      roomList.appendChild(row);
    });
  }
  
  // Fungsi untuk menampilkan daftar reservasi
  function displayReservations() {
    const reservationList = document.getElementById('reservation-list').getElementsByTagName('tbody')[0];
    reservationList.innerHTML = '';
  
    reservations.forEach((reservation, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${reservation.name}</td>
        <td>${reservation.roomNumber}</td>
        <td>${reservation.date}</td>
        <td>${reservation.startTime}</td>
        <td>${reservation.duration} jam</td>
        <td><button onclick="cancelReservation(${index})">Batalkan</button></td>
      `;
      reservationList.appendChild(row);
    });
  }
  
  // Fungsi untuk membatalkan reservasi
  function cancelReservation(index) {
    reservations.splice(index, 1);
    displayReservations();
  }
  
  // Inisialisasi tampilan
  displayRooms();
  displayReservations();

  
  // Fungsi untuk menambahkan reservasi baru
document.getElementById('reservation-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const roomNumber = parseInt(document.getElementById('roomNumber').value);
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const duration = parseInt(document.getElementById('duration').value);
  
    const room = rooms.find(room => room.number === roomNumber);
    if (!room) {
      document.getElementById('error-message').innerText = 'Ruangan tidak ditemukan.';
      return;
    }
  
    if (room.isAvailable(date, startTime, duration)) {
      const newReservation = new Reservation(name, roomNumber, date, startTime, duration);
      room.addReservation(newReservation);
      reservations.push(newReservation);
      displayReservations();
      displayRooms();
      document.getElementById('reservation-form').reset();
      document.getElementById('error-message').innerText = '';
    } else {
      document.getElementById('error-message').innerText = 'Ruangan sudah dipesan pada waktu tersebut.';
    }
  });
  