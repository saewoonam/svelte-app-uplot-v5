## This is a sveltekit app to plot sensor data from the DR.

### requirements:
* The app constantly queries a database server on port 3200 to see if there is new data to plot.
* The database is assumed to have stored all the data in the raw sensors units.  The program also loads calibration data to convert the sensor value to a usable unit.
* The basic javascript requirements are the same as those for the sveltekit version that is being used
* listens on port 60000 (look in package.json)
