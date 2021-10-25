const express = require('express')
const bodyParser = require('body-parser')
const {google} = require('googleapis');
const keys = require('./keys.json')

//initialize express
const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true })) // Set to true to allow the body to contain any type of value
app.use(bodyParser.json())

app.post('/api/RB50',  async (request, response) =>{
    const { coreid, state, rpm, distance, mov_f, mov_s } = request.body
    const auth = new google.auth.GoogleAuth({
        keyFile: "keys.json", //the key file
        //url to spreadsheets API
        scopes: "https://www.googleapis.com/auth/spreadsheets", 
    });

    //Auth client Object
    const authClientObject = await auth.getClient();
    
    //Google sheets instance
    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });

    // spreadsheet id
    const spreadsheetId = "1UU79d3xEONrwC5L3K0YqJtACCm4iECYq29bB17VSyBI";

    // Get metadata about spreadsheet
    const sheetInfo = await googleSheetsInstance.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    //Read from the spreadsheet
    const readData = await googleSheetsInstance.spreadsheets.values.get({
        auth, //auth object
        spreadsheetId, // spreadsheet id
        range: "Sheet1!A:A", //range of cells to read from.
    })
    

    //write data into the google sheets
    await googleSheetsInstance.spreadsheets.values.append({
        auth, //auth object
        spreadsheetId, //spreadsheet id
        range: "Sheet1!A:B", //sheet name and range of cells
        valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
        resource: {
            values: [[coreid, state, rpm, distance, mov_f, mov_s]]
        },
    });
    response.status(200).json('OK')
});


const PORT = 3000;

//start server
const server = app.listen(PORT, () =>{
    console.log(`Server started on port localhost:${PORT}`);
});