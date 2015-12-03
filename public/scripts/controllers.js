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
    console.log(template);

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

                console.log(1111111111);
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

    });

    $this.loadTemplate($this.templatePath, function (template) {
        document.title='Поиск';
        $this.currentPageTitle.innerHTML=StateManager.getCurrentState().title;

        $this.viewContainer.innerHTML=template;

    });

}
SearchController.prototype=Object.create(BaseController.prototype);