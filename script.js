var config = {
    authDomain: "luminous-torch-6850.firebaseapp.com",
    databaseURL: "https://luminous-torch-6850.firebaseio.com",
    storageBucket: "bucket.appspot.com"
};

firebase.initializeApp(config);
var chattyref = firebase.database().ref('chatty/');
var tweets = [];

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}


function addtweet() {
    var sender = $('#sender').val();
    var message = $('#message').val();
    if (!sender || !message) {
        alert("Please enter a name and a message before submitting a tweet!");
        return;
    }
    var newTweetRef = chattyref.push();
    console.log(Math.round(new Date().getTime()/1000));
    newTweetRef.set({
        'message': $('#message').val(),
        'sender': $('#sender').val(),
        'timeStamp': Math.round(new Date().getTime()/1000)
    });
    $('#sender').val("");
    $('#message').val("");
}

function deleteTweetFromPage(idx) {
    var temp = tweets.splice(idx, 1);
    $("#" + temp[0].key).remove();
    return temp[0].key;
}

function deleteTweetFromFirebase(key) {
    chattyref.child(key).remove();
}

function startTweetListener() {
    chattyref.on('child_added', function(tweet) {
        console.log(tweet.val(), tweet.key);
        tweets.unshift(tweet);
        if (tweets.length > 5) {
            deleteTweetFromPage(tweets.length-1); // delete the oldest tweet
        }

        $("#live-tweets").prepend(
            '<div id="' + tweet.key + '" class="card card-nav-tabs">\
                    <div class="header header-success">\
                        <div class="nav-tabs-navigation">\
                            <div class="nav-tabs-wrapper text-center">\
                                <h2 id="question">' + tweet.val().sender + '</h2>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="content">\
                        <div class="tab-content text-center">\
                            <div id="answer-form" class="row">\
                                <div class="col-sm-4 col-sm-offset-4">\
                                    <p>' + tweet.val().message + '</p>\
                                </div>\
                            </div>\
                            <button id="button' + tweet.key + '" onclick="deleteTweet(this)" class="btn btn-sm btn-danger">Delete</button>\
                        </div>\
                    </div>\
                </div>'
        );
    });
};

function deleteTweet(e) {
    var key = e.id.substring(6);
    for (var i = 0; i < tweets.length; i++) {
        if (tweets[i].key === key) {
            deleteTweetFromPage(i);
            deleteTweetFromFirebase(key);
            break;
        }
    }

}

$(document).ready(function() {
    startTweetListener();
    $('#submit-tweet').click(addtweet);
    $(document).keypress(function(e) {
        if(e.which == 13) {
            addtweet();
        }
    });
});
