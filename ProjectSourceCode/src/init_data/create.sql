DROP TABLE IF EXISTS users;
CREATE TABLE users (
  username VARCHAR(50) PRIMARY KEY,
  password	CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS health;
CREATE TABLE health (
  username VARCHAR(50) PRIMARY KEY,
  milesRun INT,
  milesBike INT,
  hoursWeights INT,
  totalCalories INT
);

  

