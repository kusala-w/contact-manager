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

CREATE OR REPLACE FUNCTION notify_contact_update()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'contact-updates',
        json_build_object(
            'id', NEW.id,
            'action', TG_OP,
            'data', NEW.id
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contact_update_trigger ON contact;

CREATE TRIGGER contact_update_trigger
AFTER INSERT OR UPDATE ON contact
FOR EACH ROW EXECUTE FUNCTION notify_contact_update();