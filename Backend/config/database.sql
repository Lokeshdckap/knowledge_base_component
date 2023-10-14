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

-- client_id  = 1009276001337-11l7egfk4ujh49irtc9io18ki6lapv80.apps.googleusercontent.com
-- serect = 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