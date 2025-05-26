# 👨🏻‍⚕️ Design and implementation of a medical records management application using a distributed, encrypted database system.
 This project focuses on developing a secure medical records management system using a locally **distributed**, **encrypted** database. The application ensures the confidentiality, integrity, and availability of sensitive patient information, aligning with modern data security standards in the healthcare sector.

Additionally, the system includes a user authentication and access management feature, allowing authorized users to log in through the application interface with the necessary credentials, ensuring proper access control.

## Prerequisites 
- **React**
- **Nodejs**
- **mongodb**
- **Docker**
  
## Required Dependencies
- body-parser: Middleware to handle incoming request bodies.
- cors: Middleware for enabling Cross-Origin Resource Sharing.
- crypto: Library for cryptographic functionality.
- dotenv: Loads environment variables from a .env file.
- express: Web framework for building APIs.
- mongodb: Official MongoDB driver for Node.js.
- mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js.
- nodemailer: Module for sending emails from Node.js.
- Installation Command
- Run the following command in your project directory to install all dependencies:

```
npm install body-parser cors crypto dotenv express mongodb mongoose nodemailer
```
## 🗄️ Distributed Database Setup

The application uses a locally distributed MongoDB setup with multiple instances running on different ports:

- **Database1** – `localhost:27018` → mapped to container port `27017`
- **Database2** – `localhost:27019` → mapped to container port `27017`
- **Database3** – `localhost:27020` → mapped to container port `27017`
- **Database4** – `localhost:27021` → mapped to container port `27017`
- 
##  🥽 to run this Project

```
cd mongo-distribution
docker-compose up
```
```
cd front
npm start 
```
## Structur application 
![image](https://github.com/user-attachments/assets/d6f40bd4-1f82-4209-b1f9-bac5302b1c78)

![image](https://github.com/user-attachments/assets/e1649a5f-7cf3-48b7-97b8-402584eb7eb4)

## Some picture of application 
![image](https://github.com/user-attachments/assets/17152092-1ab0-4ac5-be4a-7ca312a10f31)
![image](https://github.com/user-attachments/assets/63f8431d-bb17-4d21-b12f-1efb8e941951)
![image](https://github.com/user-attachments/assets/b0249917-0c5b-4398-9a63-4d997e32c103)


