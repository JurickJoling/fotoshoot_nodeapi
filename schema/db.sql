/**
* DB schema for fsdb on cassandra! 
*/ 
CREATE TABLE IF NOT exists fsdb.users
(id UUID primary KEY,
username text, 
password text,
hash_algorith text, 
email text, 
user_id int, 
old_password text
);


CREATE TABLE IF NOT exists fsdb.profiles
(id UUID ,
user_id UUID, 
account_type text,
fname text, 
lname text,
gender text, 
display_name text, 
data text, 
attributes map<text, text>,
 PRIMARY KEY(id, user_id, account_type, gender)
);

