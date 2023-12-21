drop database if exists chat_db; 
create database chat_db;  
use chat_db;  

drop  table  if exists chatbot; 
drop  table  if exists user; 

create table user_box( 
	id int auto_increment, 
   email VARCHAR(30) NOT NULL,
   name varchar(10) NOT NULL,
   provider varchar(10) NOT NULL,
   PRIMARY KEY (id)
);

create table folder( 
   FolderID int auto_increment, 
   userID int,
   Foldername varchar(30) default "New Folder",
   ParentFolderID int,
   PRIMARY KEY (FolderID),
   foreign key (userID) references user_box(id),
   FOREIGN KEY (ParentFolderID) REFERENCES folder(FolderID) ON DELETE CASCADE
);

create table room( 
   RoomID int auto_increment, 
   userID int,
   Roomname varchar(30) default "New Chat",
   folderID int,
   PRIMARY KEY (RoomID),
   foreign key (userID) references user_box(id),
   FOREIGN KEY (folderID) REFERENCES folder(FolderID) ON DELETE CASCADE
);

CREATE TABLE chatbot ( 
   id int auto_increment,
   chatRoom int,
   sequence int,
   texts MEDIUMTEXT,
   roles TINYINT check (roles in('0','1')),
   PRIMARY KEY (id),
   foreign key (chatRoom) references room(RoomID) ON DELETE CASCADE
);  

select * from chat_db.user_box;
select * from chat_db.folder;
select * from chat_db.room;
select * from chat_db.chatbot;