const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const toPdf = require("electron-html-to");
const path = require("path");
const electron = require("electron");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile)
const readFileAsync = util.promisify(fs.readFile);

const colors = {
    green: {
      wrapperBackground: "#E6E1C3",
      headerBackground: "#C1C72C",
      headerColor: "black",
      photoBorderColor: "#black"
    },
    blue: {
      wrapperBackground: "#5F64D3",
      headerBackground: "#26175A",
      headerColor: "white",
      photoBorderColor: "#73448C"
    },
    pink: {
      wrapperBackground: "#879CDF",
      headerBackground: "#FF8374",
      headerColor: "white",
      photoBorderColor: "#FEE24C"
    },
    red: {
      wrapperBackground: "#DE9967",
      headerBackground: "#870603",
      headerColor: "white",
      photoBorderColor: "white"
    }
  };

promptUser = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is your GitHub user name?"
        },
        {
            type: "list",
            name: "colors",
            message: "Pick your favorite color:",
            choices: ["green", "blue", "pink", "red"]
        }
    ]);
};

promptUser()
.then(function({ name, colors }) {
    const queryUrl = `https://api.github.com/users/${name}`;
    axios.get(queryUrl).then(function(res) {

    const username = res.data.name;
    const avatar = res.data.avatar_url;
    const location = res.data.location;
    const profile = res.data.url;
    const blog = res.data.blog;
    const githubUser = res.data.login;
    const githubLink = res.data.html_url;
    const bio = res.data.bio;
    const repos = res.data.public_repos;
    const followers = res.data.followers;
    const following = res.data.following;
    
    const queryUrlStars = `https://api.github.com/users/${name}/starred`;

    axios
    .get(queryUrlStars)
    .then(function(stars){
        const starsLength = stars.data.length;
        const githubUserData = {
            username,
            avatar,
            location,
            profile,
            blog,
            githubUser,
            githubLink,
            bio,
            repos,
            followers,
            following,
            starsLength
        };
        console.log("the value of colors is", colors)
        return generateHTML(githubUserData, colors);
        writeFileAsync("index.html", html);
      })
      .then((html) => {
          const conversion = toPdf({
            converterPath: toPdf.converters.PDF
          });
          conversion({ html: html }, function(err, result) {
            if (err) {
              return console.error(err);
            }
            result.stream.pipe(fs.createWriteStream(path.join(__dirname, "Profile.pdf")));
            conversion.kill();
          });
      });
  });
});
        
function generateHTML(githubUserData, selectedColor) {
    return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
      <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
      <title>Github Profile</title>
      <style>  @page {
              margin: 0;
            }
           *,
           *::after,
           *::before {
           box-sizing: border-box;
           }
           html, body {
           padding: 0;
           margin: 0;
           }
           html, body, .wrapper {
           height: 100%;
           }
           .wrapper {
           background-color: ${colors[selectedColor].wrapperBackground};
           padding-top: 100px;
           }
           body {
           background-color: white;
           -webkit-print-color-adjust: exact !important;
           font-family: 'Cabin', sans-serif;
           }
           main {
           background-color: #E9EDEE;
           height: auto;
           padding-top: 30px;
           }
           h1, h2, h3, h4, h5, h6 {
           font-family: 'BioRhyme', serif;
           margin: 0;
           }
           h1 {
           font-size: 3em;
           }
           h2 {
           font-size: 2.5em;
           }
           h3 {
           font-size: 2em;
           }
           h4 {
           font-size: 1.5em;
           }
           h5 {
           font-size: 1.3em;
           }
           h6 {
           font-size: 1.2em;
           }
           .photo-header {
           position: relative;
           margin: 0 auto;
           margin-bottom: -50px;
           display: flex;
           justify-content: center;
           flex-wrap: wrap;
           background-color: ${colors[selectedColor].headerBackground};
           color: ${colors[selectedColor].headerColor};
           padding: 10px;
           width: 95%;
           border-radius: 6px;
           }
           .photo-header img {
           width: 250px;
           height: 250px;
           border-radius: 50%;
           object-fit: cover;
           margin-top: -75px;
           border: 6px solid ${colors[selectedColor].photoBorderColor};
           box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
           }
           .photo-header h1, .photo-header h2 {
           width: 100%;
           text-align: center;
           }
           .photo-header h1 {
           margin-top: 10px;
           }
           .links-nav {
           width: 100%;
           text-align: center;
           padding: 20px 0;
           font-size: 1.1em;
           }
           .nav-link {
           display: inline-block;
           margin: 5px 10px;
           }
           .workExp-date {
           font-style: italic;
           font-size: .7em;
           text-align: right;
           margin-top: 10px;
           }
           .container {
           padding: 50px;
           padding-left: 100px;
           padding-right: 100px;
           }
           .row {
             display: flex;
             flex-wrap: wrap;
             justify-content: space-between;
             margin-top: 20px;
             margin-bottom: 20px;
           }
           .card {
             padding: 20px;
             border-radius: 6px;
             background-color: ${colors[selectedColor].headerBackground};
             color: ${colors[selectedColor].headerColor};
             margin: 20px;
           }
           
           .col {
           flex: 1;
           text-align: center;
           }
           a, a:hover {
           text-decoration: none;
           color: inherit;
           font-weight: bold;
           }
           @media print { 
            body { 
              zoom: .75; 
            } 
           }
        </style>
        <body>
        <div class="card">  
          <div class="wrapper">
          </div>
          </div>
            <div class="photo-header">
                <img src = ${githubUserData.avatar} alt = "pic of me">
                <h1>Hi!</h1>
                <h1>My name is ${githubUserData.username}</h1>
                <h4>Currently at ${githubUserData.location}</h4>
                <div class="links-nav">
                    <div class="links-nav">
                            <h6 class="nav-link"><i class="fas fa-map-marker-alt"></i> ${githubUserData.location}</h6>
                            <a class="nav-link" href="${githubUserData.githubLink}">
                            <i class="fab fa-github">
                            </i>GitHub</a>
                            <a class="nav-link" href="${githubUserData.blog}"><i class="fas fa-rss"></i> Blog</a>
                        </div>
                    </div>
                        
                    <div class="row">
                        <div class="col">
                            <div class="card">
                                <h2>Public Repositories</h2>
                                <h3>${githubUserData.repos}</h3>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card">
                                <h2>GitHub Stars</h2>
                                <h3>${githubUserData.starsLength}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="card">
                                <h2>Followers</h2>
                                <h3>${githubUserData.followers}</h3>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card">
                                <h2>Following</h2>
                                <h3>${githubUserData.following}</h3>
                            </div>
                        </div>
                    </div>
                    
                </div>
                </body>
        </html>
  `;
  }