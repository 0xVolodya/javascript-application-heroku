/**
 * Created by vladimir on 04.12.15.
 */
var Users = (function () {
    var spinner = document.getElementById('spinner');

    var linkHeader = {
        repositories: null,
        followings: null,
        followers: null
    };
    return {
        find: function (query, callback) {
            var xhr = new XMLHttpRequest();

            ///???
            xhr.addEventListener('loadstart', function (event) {
                spinner.style.display = 'block';
            }, false);
            //my access token for github API 1ed6245b01185d8b9e61a203f742a5f435d9407a
            xhr.open('GET', 'https://api.github.com/search/users?q=' + query
                + '&access_token=1ed6245b01185d8b9e61a203f742a5f435d9407a', true);
            xhr.send();
            xhr.addEventListener('load', function (event) {
                spinner.style.display = 'none';
                var response = event.target;
                console.log(response.status);
                if (response.status == 200) {
                    callback(JSON.parse(response.responseText));
                }
            }, false);

            xhr.addEventListener('error', function (event) {
                console.log(event);
            })

        },
        getInfo: function (userId, callback) {

        },
        getRepositories: function (udesId, callback) {

        },
        getFollowers: function (userId, callback) {

        },
        getFollowings: function (userId, callback) {

        },
        getLinkHeaders: function () {
            return linkHeader;
        }


    }
})();