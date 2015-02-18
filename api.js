/*eslint-env node*/
'use strict';

var cheerio = require('cheerio');
var request = require('request');

var baseURL = 'http://www.su.or.kr/03bible/daily/qtView.do';

var qtTypes = [
    ['QT1', '장년 매일성경'],
    ['QT6', '매일성경 순']
];

var versions = [
    ['1001', '개역개정성경'],
    ['751', '개역한글성경'],
    ['752', '아가페쉬운성경'],
    ['753', '현대어성경'],
    ['754', 'NIV영어성경'],
    ['755', 'KJV성경'],
    ['1212', '새번역역'],
    ['1255', 'ESV성경']
];

var isValidKey = function (array, key) {
    for (var i = 0; i < array.length ; i++) {
        if (array[i][0] === key) {
            return true;
        }
    }
    return false;
};

var get = function (year, month, day, qtType, version, cb) {
    request.get({
        url: baseURL,
        qs: {
            year: year, month: month, day: day,
            qtType: qtType, version: version
        }
    }, function (error, httpResponse, body) {
        var doc = cheerio.load(body);
        var title = doc('.subject').text();
        var bookLine = doc('.book_line').text()
            .replace(/\s+/g, ' ')
            .replace([year, (month < 10 ? '0' : '') + month, day].join('-'), '')
            .replace(/^\s+|\s+$/g, '');
        var re = /\[(.+)\((.+)\) (\d+):(\d+) - (\d+):(\d+)\]\s*/;
        var matched = re.exec(bookLine);
        var text = bookLine.replace(re, '');

        cb({
            title: title,
            text: text,
            bookKo: matched[1],
            bookEn: matched[2],
            fromChapter: matched[3],
            fromVerse: matched[4],
            toChapter: matched[5],
            toVerse: matched[6]
        });
    });
};

module.exports = {
    get: get,
    isValidQTType: function (qtType) {
        return isValidKey(qtTypes, qtType);
    },
    isValidVersion: function (version) {
        return isValidKey(versions, version);
    }
};
