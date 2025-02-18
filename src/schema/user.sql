CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    firstname VARCHAR(100) NOT NULL, 
    lastname VARCHAR(100) NOT NULL,         
    name VARCHAR(100) NOT NULL,
	phone VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);  
