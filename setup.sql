
-- make sure the websiteuser account is set up and has the correct privileges
CREATE USER IF NOT EXISTS websiteuser IDENTIFIED BY 'websitepassword';
GRANT INSERT, CREATE, SELECT, UPDATE, DROP, DELETE ON website.* TO websiteuser;

DROP TABLE IF EXISTS accounts;

DROP TABLE IF EXISTS events;

DROP TABLE IF EXISTS items;

CREATE TABLE IF NOT EXISTS accounts (
  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user VARCHAR(25) NOT NULL,
  pass VARCHAR(70) NOT NULL,
  role VARCHAR(25) NOT NULL
);
CREATE TABLE IF NOT EXISTS events (
  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  
  title VARCHAR(70) NOT NULL,

  user VARCHAR(25) NOT NULL,

  details VARCHAR(70) NOT NULL,

  datetime DATETIME NOT  NULL,
    
  eventid VARCHAR(10),

  picture  LONGTEXT ,

  stamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS items (

  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  
  firstitem LONGTEXT ,
  
  seconditem LONGTEXT ,

  thirditem LONGTEXT ,

  fourthitem LONGTEXT ,

  fifthitem LONGTEXT ,
  
  eventid VARCHAR(10) NOT NULL,

  user VARCHAR(25) ,  

  stamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pledgeditems (

  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  
  item TEXT ,
  

  user VARCHAR(25) ,  

  stamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO accounts(user, pass, role)
	VALUES("doej", "$2b$10$gL33obKAFUT5DK3pEbh72OIHztsWBniBBh.PdeKOrF1yr5KFAsdZO", "user");
INSERT INTO accounts(user, pass, role)
	VALUES("user1", "$2b$10$gL33obKAFUT5DK3pEbh72OIHztsWBniBBh.PdeKOrF1yr5KFAsdZO", "user");
INSERT INTO accounts(user, pass, role)
	VALUES("user2", "$2b$10$gL33obKAFUT5DK3pEbh72OIHztsWBniBBh.PdeKOrF1yr5KFAsdZO", "user");
INSERT INTO accounts(user, pass, role)
	VALUES("user3", "$2b$10$gL33obKAFUT5DK3pEbh72OIHztsWBniBBh.PdeKOrF1yr5KFAsdZO", "user");


