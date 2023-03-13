//includes
var URL = require('url');
const Book = require('../models/book');
const Author = require('../models/author');
const _respFct = require("../helpers/response_functions");

//book array
const _bookArr = [
    new Book("The Alchemist", "Paulo Coelho", 1988)
    ,new Book("The Prophet", "Kahlil Gibran", 1923)
];

const _authorArr = [
    new Author("Paulo Coelho", "Brazil", 1947)
    ,new Author("Kahlil Gibran", "Lebanon", 1883)
];

function ProcessGet(req, res) {
    const urlObj = URL.parse(req.url, true);
    const query = urlObj.query;
    var pathname = urlObj.pathname.toLowerCase();
    
    switch (pathname) {
        case "/books":
            res.writeHead(200);
            res.end(JSON.stringify(_bookArr));
            break

        case "/book":
            var title = query.title;
            let bookToFind = _bookArr.find(o => o.title === title);
            if(bookToFind === undefined)
            {
                _respFct.get500(res, `Book with title '${title}' not found !`);                    
            }
            else
            {
                res.writeHead(200);
                res.end(JSON.stringify(bookToFind));
            }            
            break

        case "/authors":
            res.writeHead(200);
            res.end(JSON.stringify(_authorArr));
            break

        case "/date":
            res.writeHead(200);
            var txt = query.year + " " + query.month;
            res.end(txt);
            break

        default:
            _respFct.get404(res);
    }
}

function ProcessDelete(req, res) {
    switch (req.url) {
        case "/book":
			collectRequestData(req, result => {
				console.log(result);

                let bookToFind = _bookArr.find(o => o.title === result.title);
                if(bookToFind === undefined)
                {
                    _respFct.get500(res, `Book with title '${result.title}' does not exists.`);                    
                }
                else
                {
                    _bookArr.pop(bookToFind);
                    _respFct.get200(res, `Book with title '${result.title}' removed !`);
                }
            });

            break

        default:
            {
                _respFct.get404(res);
            }
	}
}

function ProcessPost(req, res) {
    switch (req.url) {
        case "/books":
			collectRequestData(req, result => {
				console.log(result);

                let bookToFind = _bookArr.find(o => o.title === result.title);
                if(bookToFind !== undefined)
                {
                    _respFct.get500(res, `Book with title '${result.title}' already exists !`);                    
                }
                else
                {
                    _bookArr.push(result);
                    _respFct.get200(res, `Book with title '${result.title}' added !`);
                }
            });

            break

        default:
            {
                _respFct.get404(res);
            }
	}
}

function collectRequestData(request, callback) {
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });
    request.on('end', () => {
        callback(JSON.parse(body));
    });
}

module.exports = { ProcessGet, ProcessPost, ProcessDelete };