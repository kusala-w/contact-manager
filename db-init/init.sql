DROP TABLE IF EXISTS contact_history;
DROP TABLE IF EXISTS contact;

CREATE TABLE contact(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE contact_history(
    id SERIAL PRIMARY KEY,
    contact_id INT NOT NULL REFERENCES contact(id),
    action VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
);

