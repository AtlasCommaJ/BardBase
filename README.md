# Welcome to [BardBase](bardbase.com)!

## Development
BardBase is live at [BardBase.com](bardbase.com). You can also run a local version by doing the following: 
```
$ git clone https://github.com/AtlasCommaJ/BardBase
$ cd BardBase
$ npm install
$ npm start
```
It should then pop open at http://localhost:3000.

BardBase is built with React.js and uses CSS for styling. It was bootstrapped with Create React App.
Code is my own, plays are not (though there is some question about who really wrote them, so...?)

The app makes use of localStorage to store some state variables, so if you run into an issue while working on a feature, make sure to check there isn't anything strange in there. 

#### Future Directions
I haven't tested on a very wide variety of mobile devices yet, which seems mission-critical for use during a rehearsal.  

It seems to me that the "obvious" Version 2.0 would be allowing users to upload their own cuts of the plays, or even new scripts entirely. That would involve updating the API to handle POST and UPDATE requests instead of just GET, and would require some kind of login & authentication system. It would also mean that the database would be of variable size, and subject to scaling upwards (though it is just text, so nothing that bad). For users to upload new scripts, they would need to be in a matching CSV format, or the app would have to have an automatic formatter. 
I'll certainly look into all of these features based on how much interest Version 1 gets.  

## Data
#### Shakespeare's plays:
|The Comedies             |The Tragedies       |The Histories |The Romances         |
|-------------------------|--------------------|--------------|---------------------|
|The Comedy of Errors     |Titus Andronicus    |King John     |Pericles             |
|Taming of the Shrew      |Romeo and Juliet    |Richard II    |Cymbeline            |
|Two Gentlemen of Verona  |Julius Caesar       |1 Henry IV    |The Winter's Tale    |
|Love's Labour's Lost     |Hamlet              |2 Henry IV    |The Tempest          |
|A Midsummer Night's Dream|Othello             |Henry V       |The Two Noble Kinsmen|
|Merchant of Venice       |King Lear           |1 Henry VI    |
|Merry Wives of Windsor   |Macbeth             |2 Henry VI    |
|Much Ado About Nothing   |Antony and Cleopatra|3 Henry VI    |
|As You Like It           |Coriolanus          |Richard II    |
|Twelfth Night            |Timon of Athens     |Henry VIII    |
|Troilus and Cressida     |                    |              |
|All's Well That Ends Well|                    |              |
|Measure for Measure      |                    |              |

Ordered first by category, and then date, according to the Riverside's chronology. (Except for the histories, which are in order of events depicted, because putting 
Henry VI before Henry IV makes it look like I just don't understand roman numerals.)

#### Processing
Scripts were retrieved as text files from the [Folger Shakespeare Library](https://shakespeare.folger.edu/), then processed with Python and output as CSV files. (The raw txt weren't strictly uniform, so a lot of the python script ended up being series of "if" statements trying to catch exceptions to the rules of how character names, lines, and stage directions were formatted.)

#### Database
The database contains 37 MySQL tables, each containing the text of a play, as well as one small table mapping play names to their common abbreviations (the abbreviations are used internally to avoid problems with spaces and apostrophes).

An example of the play database schema. The string lengths are set to the maximum row in their column, so it varies somewhat from play to play. This shows Hamlet's.
| Field      | Type            | Description                     |
|------------|-----------------|---------------------------------|
| id         | int PRIMARY KEY |Line count                       |
| scene      | varchar(3)      |In {act}.{scene} form, e.g. "2.1"|
| player     | varchar(24)     |Character name                   |
| playerline | varchar(67)     |Text of individual line          |

## Deployment
The app is hosted serverless on AWS, making use of the following services:
- RDS: stores the MySQL data
- Lambda: handles queries to the database
- API Gateway: manages the REST API to connect the client to the lambda functions
- Amplify: deploys React app to the web
