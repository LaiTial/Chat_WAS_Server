drop database if exists chat_db; 
create database chat_db;  
use chat_db;  

drop  table  if exists chatbot; 
drop  table  if exists user; 

ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'abcd';

  