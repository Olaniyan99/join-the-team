//This File will handle connection logic to the MongoDB database

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:example@localhost:27017', {useNewUrlParser: true}).then(()=> {
    console.log("Sucessfully conncted to MongoDB");
}) .catch((e) => {
    console.log('Error connection to database');
    console.log(e);
})

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

module.exports = {
    mongoose 
};

