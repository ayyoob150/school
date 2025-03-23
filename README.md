## Getting Started
First, run the development server:
```bash

npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Important 
 The base directory must have .env file. It must have
 MONGODB_URI=mongodb://localhost:27017/test
 JWT_SECRET= thisissecretkey

# Note 
 if the .env file don't have mongodb url or jwt secret it will not work so this is very important.

## FE

 "npm run dev" is the command to start the project on development mode.
 http://localhost:3000 on this url, you will see list of schools.
 http://localhost:3000/signup this is the signup or register url of admin.
 http://localhost:3000/login this is the login url of admin.
 http://localhost:3000/profile this is the user profile url and you can add school if role is admin.
 on home page http://localhost:3000 you will school cards and they have thier submain url like http://school1.localhost:3000.
 if you are login with role of admin you will see a edit button in the school's cards on http://localhost:3000/ if you click on it will redirect to
 /profile page with query params and update the school.

## BE
 http://localhost:3000/api/signup this endpoint to register a user.
 http://localhost:3000/api/login this endpoint to login a user.
 http://localhost:3000/api/school this endpoint can get school list , post school profile, update school profile and delete school profile.
 http://localhost:3000/api/school/[school-name] this endpoint give school data if provide params of school name get the specific school data.