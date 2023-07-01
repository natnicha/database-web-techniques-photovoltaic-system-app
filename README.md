# Photovoltaic System App

## Prerequisite - Need to know
There are 4 services in this system including
1. Photovoltaic System Services
2. Photovoltaic System App
3. Photovoltaic System Cron
4. Photovoltaic System Batch

Work flows look like this
1. `App` call to `Services` 
2. `Services` call to `Batch`
3. `Cron` call to `Services`

You should setup/run the services in this sequence:
1. `Batch`
2. `Services`
3. `Cron` - no dependencies can setup either `App` or `Cron` first
3. `App` - no dependencies can setup either `App` or `Cron` first

## Installing the project on your machine

Install dependencies

~~~
npm install
~~~

## Running the project on your machine

1 - Run this command in the /web folder

~~~
npm run dev
~~~

2 - Enjoy!
