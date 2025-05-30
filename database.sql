CREATE DATABASE IF NOT EXISTS sims_db;
USE sims_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE spare_parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    part_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    unit_price DECIMAL(10,2),
    current_stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE stock_in (
    id INT AUTO_INCREMENT PRIMARY KEY,
    part_id INT,
    quantity INT NOT NULL,
    purchase_price DECIMAL(10,2),
    supplier VARCHAR(100),
    purchase_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (part_id) REFERENCES spare_parts(id)
);

CREATE TABLE stock_out (
    id INT AUTO_INCREMENT PRIMARY KEY,
    part_id INT,
    quantity INT NOT NULL,
    issued_to VARCHAR(100),
    issue_date DATE,
    purpose VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (part_id) REFERENCES spare_parts(id)
);
