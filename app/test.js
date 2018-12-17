var id3 = require('./node_modules/id3js/dist/id3.js');
var file = '/Users/matt/Music/tracks/DNB/DuoScience_-_Brooklyn_-_Original_-_Diskool_Records/DuoScience_-_Brooklyn_\(Original\).mp3';

id3({ type: id3.OPEN_LOCAL, file }, function (err, data) {
	console.log(data);
});
