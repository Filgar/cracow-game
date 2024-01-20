Simple map game created as diploma thesis at AGH University of Kraków.
Before running create environmental variable DB_PASSWORD. App will be available at localhost:4200.

You can also run this app via docker-compose. All you need is docker installed on your system and three files from this repo - docker-compose.yml, dbbackup/restore.sh and dbbackup/inzynierka_dump.sql. Also, you have to either create environmental variable DB_PASSWORD, or create .env file with such:
> DB_PASSWORD=totallyunguessablepassword
> 
That makes four files though.

This app was supposed to be deployed on EC2, but I underestimated how monstrous frontend frameworks are:
![image](https://github.com/Filgar/cracow-game/assets/90692119/8915dc60-1714-4a39-9905-5fb0503cb599)

That's on idle, so running it on t3.micro with 1 GiB of RAM overall was a disaster. Lesson learned.


