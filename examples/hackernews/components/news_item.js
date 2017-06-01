zuix.controller(function (cp) {
    'use strict';

    cp.create = function () {
        var item = cp.model();
        // Display item number
        cp.field('number').html(item.index+1);
        loadItem(item.id);
    };

    cp.destroy = function () {
        cp.log.i('Element disposed... G\'bye!');
    };

    function loadItem(id) {
        // Pick data from cache if exists
        var cache = window.hn_firebase_cache = window.hn_firebase_cache || {};
        if (cache[id] != null) {
            render(cache[id]);
            return;
        }
        // Fetch item data from remote service
        zuix.$.ajax({
            url: 'https://hacker-news.firebaseio.com/v0/item/'+id+'.json',
            success: function (jsonText) {
                cache[id] = JSON.parse(jsonText);
                render(cache[id]);
            }
        });
    }

    function render(newsData) {
        cp.field('title').html(newsData.title);
        cp.field('user').html(newsData.by);
        cp.field('score').html(newsData.score);
        if (newsData.descendants > 0) {
            cp.field('descendants').html(' / '+newsData.descendants+' comments');
        }
        // Use Moment.js to format time
        var timestamp = moment.unix(newsData.time);
        cp.field('date').html(timestamp.fromNow());
        // Shorten displayed URL (if present)
        if (newsData.url != null) {
            var path = newsData.url.split('/');
            if (path.length > 0) {
                path = path[2].replace('www.', '') + (path[3] != null && path[3].length > 0 && path[3].length < 30 && path[3].indexOf('.') < 0 ? '/' + path[3] : '');
            }
            cp.field('url').html(path).attr('href', newsData.url);
        }
        // Custom Events for this component
        var card = cp.field('card');
        var payload = {
            view: card,
            data: newsData
        };
        card.on('mouseover', 'item:enter', payload)
            .on('mouseout', 'item:leave', payload)
            .on('click', 'item:click', payload);
    }

});
