# Photovoltaic System Application ⛅
In today's world, good planning with digital tools is a great advantage, especially when it comes to private and business electricity planning. One approach is the photovoltaic system (PV/PS system). The problem is that it is often very difficult to calculate or specify in advance the usability and effectiveness of a photovoltaic system for a particular application in a particular place on the planet with a particular manufacturer. For this reason, it will be the challenge to create a basic possibility for better planning of photovoltaic systems based on digital tools.

## 🎯 Goal
To build a prototype of a web-based calculation system for a photovoltaic system 
with a specific manufacturer and product of your choice based on current weather data and 
local conditions.


## 🌍 Key Features
The application consists of the following features:
- [x] Register/Login/Logout/Update/Delete a User Profile​

- [x] Overview page with filter over their projects​

- [x] Create/Update/Delete a project/product with 6 parameters​ including Power peak, orientation(N/E/S/W), inclination/tilt, area (m²), longitude, and latitude


- [x] Visual map for each project​

- [x] Export generated energy reports​ and get them right away by registered email


## 🧳 Perfect For
- Ideal for those who want to see how productive their solar panels can be.


## 📱 Visual
Create your project, add a solar panel based on your installation’s latitude and longitude, and view your products on a real-world map — and boom! The usability and effectiveness of your photovoltaic system are calculated and headed straight to your inbox! ⛅📧

![Photovoltaic](./assets/demo.gif)

## 💻 About Project
### Prerequisite
There are 4 services in this system including
1. [Photovoltaic System Services](https://github.com/natnicha/database-web-techniques-photovoltaic-system-services)
2. Photovoltaic System App: This project
3. [Photovoltaic System Cron](https://github.com/natnicha/natnicha-database-web-techniques-photovoltaic-system-cron)
4. [Photovoltaic System Batch](https://github.com/natnicha/database-web-techniques-photovoltaic-system-batch)

Work flows look like this
1. `App` call to `Services` 
2. `Services` call to `Batch`
3. `Cron` call to `Services`

You should setup/run the services in this sequence:
1. `Batch`
2. `Services`
3. `Cron` - no dependencies can setup either `App` or `Cron` first
3. `App` - no dependencies can setup either `App` or `Cron` first

### Installing the project on your machine

Install dependencies

~~~
npm install
~~~

### Running the project on your machine

1 - Run this command in the /web folder

~~~
npm run dev
~~~

2 - Enjoy!

## 💻Contributing

If you have any suggestion that would make our website looks better or more convenience, please fork the repo and create a merge requeste. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thank you again!

1. Fork the Project
2. Create your Feature Branch 
    ```
    git checkout -b feature/AwesomeFeature
    ```
3. Commit your Changes 
    ```
    git commit -m 'Add some AwesomeFeature'
    ```
4. Push to the Branch
    ```
    git push origin feature/AwesomeFeature
    ```
5. Open a Pull Request


## 👨‍⚖️Project Contributor & Support
This project is contributed by **Natnicha Rodtong** as a part of Database and Web Technique under Master's degree program, Informatik (Computer Science), Web Engineering, [Technische Universität Chemnitz](https://www.tu-chemnitz.de), Germany. Feel free to reach out to me with any ideas or suggestions—I'd love to hear from you!
