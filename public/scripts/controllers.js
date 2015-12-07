/**
 * Created by vladimir on 03.12.15.
 */

/*Main controller*/
function BaseController() {
    this.currentPageTitle = document.getElementById("currentPageTitle");
    this.viewContainer = document.getElementById("viewContainer");
    this.spinner = document.getElementById("spinner");
}

BaseController.prototype.loadTemplate = function (pathToTemplate, callback) {
    var template = sessionStorage.getItem(pathToTemplate);

    if (!template) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', pathToTemplate, true);
        xhr.send();
        xhr.addEventListener('load', function (event) {
            var respond = event.target;
            if (respond.status == 200) {
                template = respond.responseText;

                //sessionStorage.setItem(pathToTemplate,template);
                callback(template);
            }
        }, false);
    }
    else {
        callback(template);
    }
};


BaseController.prototype.makeUserList = function (userList) {
    var content = document.getElementsByClassName('content')[0];
    console.log(document);
    var fragment = document.createDocumentFragment();
    var ul = document.createElement('ul');
    ul.className = 'user-list';
    var li = document.createElement('li');
    var a = document.createElement('a');
    userList.forEach(function (user) {

        a = document.createElement('a');
        a.href = '/profile/' + user.id + '/main';
        a.className = 'user-list__link';
        a.appendChild(document.createTextNode(user.login));
        li = document.createElement('li');
        li.className = 'user-list__item';
        li.appendChild(a);
        fragment.appendChild(li);

    });
    ul.appendChild(fragment);
    console.log(ul);
    content.appendChild(ul);
};

//Типо шаблонизатор, заменяет {{variable}} на значение
BaseController.prototype.parseTemplate = function (template, data) {
    var regexp;

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var r = new RegExp('{{' + key + '}}', 'g');

            regexp = r;
            template = template.replace(regexp, data[key]);
        }
    }
    return template;
};

//BaseController.prototype.changeTabs = function (name) {
//console.log('BaseController.prototype.changeTabs');
//    window.addEventListener('load', function (event) {
//        var list = document.getElementsByClassName('active');
//
//        var elements = document.getElementsByTagName('li'); // or other html element
//        for (var i = 0; i < elements.length; i++) {
//            console.log(elements.className);
//        }
//        var addActive = document.getElementsByClassName('tabs__item-' + name);
//        console.log(addActive);
//
//        list.classList.remove("active");
//
//        addActive.className += ' active';
//    });
//};

/*Controller for searching users */
function SearchController() {

    BaseController.call(this);
    var $this = this;
    this.templatePath = '/templates/search.html';

    var searchHandler = (function (event) {
        var self = this;
        self.searchInput.removeEventListener('keyup', searchHandler, false);

        setTimeout(function () {
            var element = event.target;
            if (element.value.length == 0) {
                self.searchPlaceholder.style.display = "block";
                self.searchArea.style.display = "none";
                self.notFoundBlock.style.display = "none";
            } else {
                Users.find(element.value, function (usersData) {
                    self.searchPlaceholder.style.display = "none";
                    self.searchArea.style.display = "block";
                    self.notFoundBlock.style.display = "none";
                    var userList = document.createDocumentFragment();
                    var ul = document.createElement('ul');
                    var li = null;
                    var a = null;
                    ul.className = 'search-result__list';
                    usersData.items.forEach(function (user) {
                        li = document.createElement('li');
                        li.className = 'search-result__item';
                        a = document.createElement('a');
                        a.className = 'search-result__link';
                        a.href = "/profile/" + user.id + "/main";
                        a.appendChild(document.createTextNode(user.login));
                        li.appendChild(a);
                        userList.appendChild(li);

                    });
                    ul.appendChild(userList);
                    self.searchArea.replaceChild(ul, self.searchArea.firstElementChild);
                })

            }
            self.searchInput.addEventListener('keyup', searchHandler, false);

        }, 500);

    }).bind(this);

    $this.loadTemplate($this.templatePath, function (template) {
        document.title = 'Поиск';

        $this.currentPageTitle.innerHTML = StateManager.getCurrentState().title;
        $this.viewContainer.innerHTML = template;

        $this.searchArea = document.getElementById('searchArea');
        $this.searchInput = document.getElementById('searchInput');
        $this.searchPlaceholder = document.getElementById('searchPlaceholder');
        $this.notFoundBlock = document.getElementById('resultNotFound');

        $this.searchInput.addEventListener('keyup', searchHandler, false);

    });

}
SearchController.prototype = Object.create(BaseController.prototype);

//
function ProfileMainController() {
    BaseController.call(this);
    var self = this;
    var userId = RegExp.$1;


    self.templatePath = '/templates/profile_main.html';

    Users.getInfo(userId, function (receiveData) {
        self.data = receiveData;

        self.loadTemplate(self.templatePath, function (template) {
            //self.spinner.style.du
            document.title = 'Main Info';
            self.currentPageTitle.innerHTML = StateManager.getCurrentState().title;

            self.viewContainer.innerHTML = self.parseTemplate(template, {
                userId: userId,

                avatar: receiveData.avatar_url,
                company: receiveData.company || 'Не указано',
                name: receiveData.name || 'Не указано',
                public_repos: receiveData.public_repos,
                followers: receiveData.followers,
                link: receiveData.html_url

            });
        })
    })


}

ProfileMainController.prototype = Object.create(BaseController.prototype);

function ProfileFollowersController() {
    BaseController.call(this);
    var self = this;
    var userId = RegExp.$1;

    self.templatePath = '/templates/profile.followers.html';
    console.log('ProfileFollowersController');

    var followers;
    Users.getFollowers(userId, function (followersList) {

        self.loadTemplate(self.templatePath, function (template) {
            document.title = 'Список фолловеров';
            self.currentPageTitle.innerHTML = StateManager.getCurrentState().title;

            self.viewContainer.innerHTML = self.parseTemplate(template, {
                userId: userId
            });
            self.makeUserList(followersList);
            console.log('loadTemplate(self.templatePath');
        });
    });


}

ProfileFollowersController.prototype = Object.create(BaseController.prototype);

function ProfileFollowingController() {
    BaseController.call(this);
    var self = this;
    var userId = RegExp.$1;

    var templatePath = '/templates/profile.following.html';
    Users.getFollowings(userId, function (following) {

        self.loadTemplate(templatePath, function (template) {
            document.title = StateManager.getCurrentState().title;
            self.currentPageTitle = StateManager.getCurrentState().title;

            self.viewContainer.innerHTML = self.parseTemplate(template, {
                userId: userId
            });
            self.makeUserList(following);
        })
    })

}

ProfileFollowingController.prototype = Object.create(BaseController.prototype);

function ProfileRepositoriesController() {
    BaseController.call(this);
    var self = this;
    var templatePath = '/templates/profile.repositories.html';
    var userId = RegExp.$1;
    Users.getRepositories(userId, function (repositories) {

        self.loadTemplate(templatePath, function (teamplate) {
            document.title = StateManager.getCurrentState().title;
            self.currentPageTitle = StateManager.getCurrentState().title;
            self.viewContainer.innerHTML = self.parseTemplate(teamplate, {
                userId: userId
            });


            var content = document.getElementsByClassName('content')[0];
            console.log(content);
            var fragment = document.createDocumentFragment();
            var a = null;
            var li = null;
            var ul = document.createElement('ul');
            var span=null;
            ul.className = 'repositories';
            repositories.forEach(function (element) {
                a = document.createElement('a');

                a.href = repositories.html_url;
                a.className = 'repositories__link';
                span=document.createElement('span');
                span.className='repositories__text';

                span.innerHTML=element.name;
                a.appendChild(span);

                span=document.createElement('span');
                span.innerHTML='description: '+element.description;
                span.className='repositories__text-description';
                a.appendChild(span);

                li = document.createElement('li');
                li.className = 'repositories__item';
                li.appendChild(a);
                fragment.appendChild(li);
            });
            ul.appendChild(fragment);
            console.log(ul);
            content.appendChild(ul);



        });

    })
}
ProfileRepositoriesController.prototype = Object.create(BaseController.prototype);
