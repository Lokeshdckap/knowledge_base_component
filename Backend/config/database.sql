CREATE TABLE users (
   id SERIAL PRIMARY KEY ,
   name varchar(255),
   email varchar(255),
   password varchar(255),
	google_id varchar(255),
    avatar varchar(255),
	email_verified_at timestamp,
   role_as int,
   created_by_id int,
   updated_by_id int,
   created_at timestamp,
   updated_at timestamp

);
