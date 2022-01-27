const fs = require('fs');
const request = require('request');
const yargs = require('yargs');


var download = (uri, filename,count)=> {
    request.head(uri, function (err, res, body) {
        // console.log('content-type:', res.headers['content-type']);
        // console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', ()=>console.log(`downloaded ${count}`));
    });
};


const getDowloadLinks =  (search, accessKey) => {


    const url = `https://api.unsplash.com/search/photos?query=${search}&client_id=${accessKey}`;
     request({ url: url, json: true }, (error, response) => {
        if (error)
            console.log('something went wrong');
        else {
            let data = response.body.results.map(image => {
                return image.links.download;
            })

            // fs.writeFileSync('./imageDownloadLinks.json', JSON.stringify(data));
            // download images 
            let count = 1;
            // let tempArray = [data[0]];
            data.forEach(link => {

                const filename = `./images/${search}_image_${count}.png`;
                console.log(filename);
                download(link, filename,count);
                count = count + 1;

            })

        }
    })


}


// getDowloadLinks('cow','zzXgEie98-hLrKyFpa-A_keKjABC_LKXdFkUfTv8oy4');

// input from command line 
yargs.version('1.1.0');

yargs.command({
    command: 'getimages',
    describe: 'download images from unsplash image api',
    builder:{
        search:{
            describe:'what you want to search for',
            demandOption: true,
            type: 'string'
        },
        accessKey:{
            describe: 'accessKey for the unsplash api',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv){
        getDowloadLinks(argv.search, argv.accessKey);
    }
})

yargs.parse();