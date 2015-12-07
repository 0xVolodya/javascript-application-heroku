/**
 * Created by vladimir on 03.12.15.
 */
var app = (function () {
    return {
        init: function () {
            window.history.pushState(null,null,'/templates/search.html');
            StateManager.restore();
            StateManager.setHandler();
        }
    }
})();
var StateManager = (function () {
    var states = [
            {
                name: 'search',
                title: 'поиск пользователей',
                pattern: /^\/$/,
                controller: SearchController
            },
            {
                name:"profile.main",
                title:'Основная информация',
                pattern:/^\/profile\/([0-9]+)\/main$/,
                controller: ProfileMainController
            },
            {
                name:"profile.followers",
                title:'Фолловеры',
                pattern:/^\/profile\/([0-9]+)\/followers$/,
                controller: ProfileFollowersController
            },
            {
                name:"following",
                title:'Подписки',
                pattern:/^\/profile\/([0-9]+)\/following$/,
                controller: ProfileFollowingController
            },
            {
                name:"repositories",
                title:'Репозитории',
                pattern:/^\/profile\/([0-9]+)\/repositories$/,
                controller: ProfileRepositoriesController
            }

        ],
        currentState = null;

    //Определение текущей странички по states
    var setCurrentState = function () {
        console.log(window.history);
        console.log(history.state);
        for (var i = 0; i < states.length; i++) {
            console.log(states[i].pattern.test(history.state)+' '+location.hash);
            if (states[i].pattern.test(location.hash)) {
                currentState = states[i];
                break;
            }
            currentState = null;
        }
    };
    var stateHandler= function () {
        setCurrentState();
        if(currentState){

            new currentState.controller();// new currentState.controller(currentState);
        }
    };

    return {
        restore: function () {
                stateHandler();

        },
        setHandler: function () {
            window.addEventListener('hashchange',stateHandler,false);
        },
        getCurrentState: function () {
            return currentState;
        }
    }
})();

window.addEventListener('load', function (event) {

    app.init();
});