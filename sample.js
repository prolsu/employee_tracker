const mysql = require('mysql');
const inquirer = requirer('inquirer');

const connection = mysql.createConnection({
  host: "tracker",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password & database
  password: "123Pensql#!&",
  database: "employee_trackerDB"
});

connection.connect(err => {
  if (err) throw err;
  console.log(`Connected as id ${connection.threadId}`);
  // connection.end();

  // connection.query("SELECT * FROM Top5000", (err, res) => {
  //   if (err) throw err;
  //   // console.log(res);
  
  //   let query = res.forEach(song => console.log(`You are listening to '${song.song_name}' from '${song.artist}'`));
    
  //   connection.end();
  // });

  //CRUD = Create, Retrieve, Update, and Delete
 
  // function addSong(){
  //   let query = connection.query("INSERT INTO Top5000 SET (artist, song_name,year_released, usa_popularity_score, uk_popularity_score, europe_popularity_score, world_popularity_score, fifthscore) VALUES ?", {
  //     artist: "artist",
  //     song_name: "song name",
  //     year_released: "1988"
  //   },
  //   (err, res) => {
  //     if(err) throw err;
  //     console.log(`${res.affectedRows} Song Inserted`);
  //     // selectSong();
  //   })
  // }
  // addSong()

//   function selectSong(){
//     let query = connection.query("UPDATE Top5000 SET ? WHERE ?" ,[
//       {
//         genre: "Rock"
//       },
//       {
//         id: 3
//       }
//     ],
//     (err, res) => {
//       if(err) throw err;
//       console.log(`${res.affectedRows} Genre Updated`)
//       deleteSong();
//     })
//   }

  function deleteSong() {
    let query = connection.query("DELETE FROM Top5000 WHERE ?", {
      id: 2
    },
    (err, res) => {
      if(err) throw err;
      console.log(`${res.affectedRows} song deleted`)
      // readSong();
    })
  }
  // deleteSong();

  // return songs by a specific artist...
  function retrieveAllSongsByArtist() {
    let query = connection.query("SELECT * FROM Top5000 WHERE artist = 'Eminem'",
    (err, res) => {
      if (err) throw err;
      console.log(res);
    })
  }
  retrieveAllSongsByArtist()
  
  //
  function artistsShownMoreThanOnce() {
    let query = connection.query("SELECT * FROM Top5000 WHERE artist = 'Cher'",
    (err, res) => {
      if (err) throw err;
      console.log(res);
    })
  }
  // artistsShownMoreThanOnce()

  //
  function searchForASong() {
    let query = connection.query("SELECT * FROM Top5000 WHERE song_name = 'Lose Yourself'",
    (err, res) => {
      if (err) throw err;
      console.log(res);
    })
  }
  // searchForASong()

  connection.end()
});