CREATE TABLE IF NOT EXISTS turnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mascota VARCHAR(100) NOT NULL,
    duenio VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO turnos (id, mascota, duenio, fecha, hora, motivo)
VALUES
    (1, 'Luna', 'Mariana', '2026-05-20', '09:30:00', 'Vacunacion anual'),
    (2, 'Toby', 'Carlos', '2026-05-20', '11:00:00', 'Control general')
ON DUPLICATE KEY UPDATE
    mascota = VALUES(mascota),
    duenio = VALUES(duenio),
    fecha = VALUES(fecha),
    hora = VALUES(hora),
    motivo = VALUES(motivo);
