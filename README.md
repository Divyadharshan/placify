<div align="center"> <h1> Placify </h1> </div>

Placify is a web application that allows users to explore and manage places. The platform includes features for user authentication, real-time communication, and adding/editing place entries. Users can also leave reviews for places they visit, making it a community-driven platform. 

## Features

- **User Authentication**: Secure login and registration system using sessions. New user is registered after verifying their mail.
- **Place Listings**: View a list of places, each with detailed information.
- **Add/Edit Places**: Users can add new places or edit existing ones.
- **Leave Reviews and Rating**: Users can leave reviews and ratings for places they have visited.
- **Flash Messages**: Notifications for successful or failed actions, using `flash` messages.
- **Session Management**: Session handling to keep users logged in across different pages. 
- **Forgot Password**: Allows users to reset their password using a JWT token with an expiry time. Password reset emails are sent using Nodemailer.
- **Google Sign-In/Sign-Up(Oauth)**: Enables users to sign in/sign up using their Google accounts.
- **User Profile**: Individual user profiles display details about their contributions.
- **Profile/Username Edit**: Users can change their profile picture, username(it's always unique).
- **Restricted Edit Access**: Only the author can edit their contributions. Admins can edit all contributions.
- **Rule Based Chatbot**: Users can chat with bot with pre-defined prompts

## Technologies Used

- **EJS**: Template engine for rendering HTML views.
- **HTML & CSS**: For building and styling the frontend.
- **JavaScript (Client-side)**: For interactive features and handling user input.
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building the backend and handling routes.
- **MongoDB**: Database to store user and place data.
- **Passport.js**: Authentication middleware for secure login and registration.
- **Sessions**: To store user data and maintain login status.
- **Flash Messages**: Display success or error messages.

## Installation

To run the project locally, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.
- [MongoDB](https://www.mongodb.com/) running locally or use a cloud database like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Steps

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/Divyadharshan/placify.git
2. Navigate to the project directory:
   ```
   cd placify
3. Install the dependencies:
   ```
   npm install
4. Set up your MongoDB database:
   
   * If you're using MongoDB locally, ensure MongoDB is running.
   * you're using MongoDB Atlas, update the connection URL in your .env file.
     
6. Create an .env file and configure the necessary environment variables

7. Run the project:
    ```
    npm start
8. Open your browser and navigate to http://localhost:3000 to view the application.
   
### Usage

* Registration and Login: Users can register and log in to the platform to access features such as adding places and leaving reviews.
* Place Management: After logging in, users can add new places, edit existing places, and leave reviews.
* Reviews: Users can submit reviews for places, including rating them and writing comments.

## Live Demo
- [https://placify-three.vercel.app](https://placify-three.vercel.app)

### Courtesy : Colt Steele (Udemy Instructor)
