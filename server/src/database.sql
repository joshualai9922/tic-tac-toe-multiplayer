CREATE DATABASE tic_tac_toe_multiplayer;

\c tic_tac_toe_multiplayer  

CREATE TABLE tic_tac_toe_multiplayer (
  game_id SERIAL PRIMARY KEY,
  user_username VARCHAR(255), 
  opponent_username VARCHAR(255),
  result VARCHAR(255)
);