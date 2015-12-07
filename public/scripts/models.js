/**
 * Created by vladimir on 04.12.15.
 */
//возвращает JSON объекты
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
            //my access token for github API 3699db9001042473393feca5ebdc18a8665c7551
            xhr.open('GET', 'https://api.github.com/search/users?q=' + query
                + '', true);
            xhr.send();
            xhr.addEventListener('load', function (event) {
                spinner.style.display = 'none';
                var response = event.target;
                if (response.status == 200) {
                    callback(JSON.parse(response.responseText));
                }
            }, false);

            xhr.addEventListener('error', function (event) {
            })

        },
        getInfo: function (userId, callback) {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', 'https://api.github.com/user/' + userId
                + '', true);

            xhr.send();
            xhr.addEventListener('load', function (event) {
                var response = event.target;
                if (response.status == 200) {
                    callback(JSON.parse(response.responseText));
                }
            }, false);
        },
        getRepositories: function (userId, callback) {
            var xhr=new XMLHttpRequest();
            var self=this;
            self.getRepositories.page=1;
            xhr.open('GET', 'https://api.github.com/user/' + userId
                + '/repos?page='+self.getRepositories.page);
            console.log('GET', 'https://api.github.com/user/' + userId
                + '/repos?page='+self.getRepositories.page);
            xhr.send();

            xhr.addEventListener('load', function (event) {
                var response=event.target;
                if(response.status==200){
                    self.getRepositories.page+=1;
                    callback(JSON.parse(response.responseText));
                }
            })

        },
        //getFollowers: function (userId, callback) {
        //    var xhr = new XMLHttpRequest();
        //
        //    var self = this;
        //    self.page = 1;
        //
        //
        //    xhr.open('GET', 'https://api.github.com/user/' +
        //        userId + '/followers&access_token=3699db9001042473393feca5ebdc18a8665c7551&page='
        //        + self.page);
        //
        //    xhr.send();
        //
        //    xhr.addEventListener('load', function (event) {
        //        var response = event.target;
        //
        //        if (response.status == 200) {
        //            self.getFollowers.page += 1;
        //            //linkHeaders.followers = response.getResponseHeader('Link');
        //            callback(JSON.parse(response.responseText));
        //        }
        //    })
        //},
        //
        getFollowers: function (userId, callback) {
            var xhr = new XMLHttpRequest();
            var self = this;

            self.getFollowers.page = 1;
            xhr.open('GET', 'https://api.github.com/user/' + userId +
                '/followers?page=' +
                self.getFollowers.page, true);

            xhr.send();

            xhr.addEventListener('load', function (event) {
                var response = event.target;
                if (response.status == 200) {
                    self.getFollowers.page += 1;
                    //linkHeaders.followers = response.getResponseHeader('Link');
                    callback(JSON.parse(response.responseText));
                }
            }, false);
        },

        getFollowings: function (userId, callback) {
            var xhr = new XMLHttpRequest();
            var self=this;
            console.log(self);
            self.getFollowings.page=1;

            xhr.open('GET','https://api.github.com/user/'+userId+'/following?page='+
                self.getFollowings.page);

            xhr.send();

            xhr.addEventListener('load', function (event) {
                var response=event.target;

                if(response.status==200){
                    self.getFollowings.page+=1;
                    callback(JSON.parse(response.responseText));
                }
            },false);
        },

        getLinkHeaders: function () {
            return linkHeader;
        }


    }
})();