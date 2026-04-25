-- ==================================================
-- MobileShop Database Setup
-- Database: phshop
-- Safe to run multiple times
-- ==================================================

CREATE DATABASE IF NOT EXISTS phshop
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE phshop;

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
    id       BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id       BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    email    VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id             BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(200) NOT NULL UNIQUE,
    price          DOUBLE       NOT NULL,
    stock          INT          NOT NULL DEFAULT 0,
    image          VARCHAR(500),
    discount       INT          NOT NULL DEFAULT 0 COMMENT 'Percentage discount 0-100',
    is_new_arrival TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '1 = show New Arrival badge'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id             BIGINT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT      NOT NULL,
    product_id     BIGINT      NOT NULL,
    quantity       INT         NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    order_date     DATETIME    NOT NULL,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Backward-compatible migrations for older schemas
SET @has_brand := (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'products' AND column_name = 'brand'
);
SET @sql := IF(@has_brand > 0,
    'ALTER TABLE products MODIFY COLUMN brand VARCHAR(255) NULL DEFAULT ''''',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_total_price := (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'orders' AND column_name = 'total_price'
);
SET @sql := IF(@has_total_price > 0,
    'ALTER TABLE orders MODIFY COLUMN total_price DOUBLE NULL DEFAULT 0',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Seed default admin
INSERT INTO admin (username, password) VALUES ('admin@mobileshop.com', 'admin123')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- Seed products (name, price LKR, stock, image, discount%, is_new_arrival)
INSERT INTO products (name, price, stock, image, discount, is_new_arrival) VALUES
    ('iPhone 16 Pro Max',        389999, 15, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 20, 1),
    ('iPhone 16',                229999, 22, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 10, 1),
    ('iPhone 15 Pro',            289999, 10, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400', 15, 0),
    ('iPhone 15',                199999,  8, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400', 12, 0),
    ('iPhone 14',                159999, 12, 'https://images.unsplash.com/photo-1574154894072-16736a4f0f96?w=400',  8, 0),
    ('Samsung Galaxy S25 Ultra', 299999, 18, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',  0, 1),
    ('Samsung Galaxy S25+',      199999, 20, 'https://images.unsplash.com/photo-1610945265264-53b5f0643af5?w=400',  5, 1),
    ('Samsung Galaxy S25',       159999, 25, 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400',  5, 1),
    ('Samsung Galaxy Z Fold 6',  349999,  6, 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400',  0, 1),
    ('Samsung Galaxy A55 5G',     79999, 35, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 10, 1),
    ('Samsung Galaxy A35',        54999, 40, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400',  0, 0),
    ('Google Pixel 9 Pro XL',    189999, 14, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',  0, 1),
    ('Google Pixel 9',           129999, 18, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',  0, 1),
    ('Google Pixel 8a',           89999, 20, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400', 18, 0),
    ('OnePlus 13',               149999, 30, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',  0, 1),
    ('OnePlus 12R',              109999, 25, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400', 18, 0),
    ('OnePlus Nord 4',            74999, 30, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 12, 0),
    ('Xiaomi 14 Ultra',          169999, 12, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400', 15, 1),
    ('Xiaomi Redmi Note 14 Pro',  62999, 45, 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400',  0, 1),
    ('Xiaomi Redmi 13C',          27999, 60, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400', 10, 0),
    ('OPPO Find X8 Pro',         219999, 10, 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400',  0, 1),
    ('OPPO Reno 12 Pro',          89999, 20, 'https://images.unsplash.com/photo-1574154894072-16736a4f0f96?w=400',  8, 0),
    ('Vivo X200 Pro',            175999, 12, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',  0, 1),
    ('Vivo V30 Pro',              84999, 22, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',  5, 0),
    ('Sony Xperia 1 VI',         238999,  7, 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400', 12, 1),
    ('Sony Xperia 5 V',          169999,  5, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400',  0, 0),
    ('Motorola Edge 50 Ultra',   104999, 18, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400',  0, 1),
    ('Motorola Edge 50',          64999, 30, 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400',  7, 0),
    ('Nokia X60 Pro',             74999, 25, 'https://images.unsplash.com/photo-1574154894072-16736a4f0f96?w=400',  0, 1),
    ('Nokia G60',                 29999,  0, NULL, 0, 0),
    ('Realme GT 6',               94999, 22, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',  0, 1),
    ('Realme Narzo 70 Pro',       49999, 35, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',  5, 0)
ON DUPLICATE KEY UPDATE
    price = VALUES(price),
    stock = VALUES(stock),
    discount = VALUES(discount),
    is_new_arrival = VALUES(is_new_arrival);

-- Optional verification
-- SELECT * FROM admin;
-- SELECT id, name, price, discount, is_new_arrival, stock FROM products ORDER BY id;
-- SHOW TABLES;
