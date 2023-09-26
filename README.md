# PLM


## Description
PLM stands for product listing manager , it's mini ecommerce app that consist at listing products and display or managing all different products with dynamic priced based on the user currency using React, TypeScript, Node.js, Express, MongoDB, Tailwind CSS, JWT authentication, and a REST API.

## Getting started (how to run the project)

Clone the repo
```
git clone https://github.com/hadilXattia/test-technique.git
```

### To run the REST API(the backend part ), run:
```
1/cd PLM
2/npm install
3/create file .env and fill it with this info :{
MONGODB_URI = "url to connect to your mongodb"
SECRET = 'any text dosen't matter'}

4/npm run devstart
```

The REST API is now running at `localhost:3000`.


go to ipinfo and get a token for free to run the api correctly 
https://ipinfo.io/

### To run the front part, open another terminal window and run:

```
cd client
npm install
npm run build

enter file config and put token IPINFO TOKEN 

npm start
```

The front part is now running at `localhost:5000`.
Notes: Tips and Advice
Since it's a small project, I created a login for admins in the simplest way possible (the admin key is 'adminadmin'). For more security, I would use Nodemailer to verify the admin, and instead of a username, it will be an email. However, since there are more functionalities to focus on, I chose the easier way.

### The user experience:
 For the panel, I chose cards for products instead of tables and data grids because it's more minimalist, and there is not much information to display. If there are more details, I would recommend using data grids from Material UI.
same goes for the navbar , because we don't have much links i used it to display the dashboard and the create product link , if there are more links i would recomand that the 'create , dashboards , logout ' become contained in a drop down . 


for the geolocation part we have two option eather , build a file and put all currency and countries manually  and use it or use one of the free api which i choose to optimize the work and code 
