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
        console.log(xhr);
        console.log(xhr.status);
        xhr.addEventListener('load', function (event) {
            var respond=event.target;
            if(respond.status==200){
                template=respond.responseText;

                //sessionStorage.setItem(pathToTemplate,template);
                callback(template);
            }
        },false);
    }
    else{
        callback(template);
    }
};

/*Controller for searching users */
function SearchController() {

    console.log('SearchController');
    BaseController.call(this);
    var $this = this;
    this.templatePath = '/templates/search.html';

    var searchHandler = (function (event) {
        var self=this;
        self.searchInput.removeEventListener('keyup',searchHandler,false);

        setTimeout(function () {
            var element=event.target;
            console.log(element.value.length);
            if(element.value.length==0){
                self.searchPlaceholder.style.display="block";
                self.searchArea.style.display="none";
                self.notFoundBlock.style.display="none";
            }else{
                Users.find(element.value, function (usersData) {
                    self.searchPlaceholder.style.display="none";
                    self.searchArea.style.display="block";
                    self.notFoundBlock.style.display="none";
                    var userList=document.createDocumentFragment();
                    var ul=document.createElement('ul');
                    var li=null;
                    var a=null;
                    ul.className='search-result__list';
                    usersData.items.forEach(function (user) {
                        li=document.createElement('li');
                        li.className='search-result__item';
                        a=document.createElement('a');
                        a.className='search-result__link';
                        a.appendChild(document.createTextNode(user.login));
                        li.appendChild(a);
                        userList.appendChild(li);

                    });
                    ul.appendChild(userList);
                    self.searchArea.replaceChild(ul,self.searchArea.firstElementChild);
                })

            }
            self.searchInput.addEventListener('keyup', searchHandler,false);

        },500);

    }).bind(this);

    $this.loadTemplate($this.templatePath, function (template) {
        document.title='Поиск';

        $this.currentPageTitle.innerHTML=StateManager.getCurrentState().title;
        $this.viewContainer.innerHTML=template;

        $this.searchArea        = document.getElementById('searchArea');
        $this.searchInput       = document.getElementById('searchInput');
        $this.searchPlaceholder = document.getElementById('searchPlaceholder');
        $this.notFoundBlock     = document.getElementById('resultNotFound');

        $this.searchInput.addEventListener('keyup', searchHandler, false);

    });

}
SearchController.prototype=Object.create(BaseController.prototype);