
CREATE DATABASE IF NOT EXISTS lasalle_virtual_db;

USE lasalle_virtual_db;

-- Create the table for the users
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    facility VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    secondary_email VARCHAR(255),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    password_reset BOOLEAN NOT NULL DEFAULT FALSE,
    isActive BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create the table for the event containers
CREATE TABLE IF NOT EXISTS event_containers (
    event_container_id INT AUTO_INCREMENT PRIMARY KEY,
    facility VARCHAR(50) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    start_day VARCHAR(20) NOT NULL,
    end_day VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration VARCHAR(50) NOT NULL DEFAULT "30 min",
    time_zone VARCHAR(50) NOT NULL,
    meeting_type VARCHAR(50) NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL,
    isDeleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create the table for scheduled meetings
CREATE TABLE IF NOT EXISTS scheduled_meetings (
    meeting_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    facility VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    meeting_date DATE NOT NULL,
    meeting_time TIME NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    notes TEXT,
    isDeleted BOOLEAN DEFAULT false
);



