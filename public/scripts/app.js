/**
 * Created by vladimir on 03.12.15.
 */
var app = (function () {
    return {
        init: function () {
            if (!location.hash) {
                location.hash = "#/";
            }
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
                pattern: /^#\/$/,
                controller: SearchController
            },
            {
                name:"profile.main",
                title:'Основная информация',
                pattern:/^#\/profile\/([0-9]+)\/main$/,
                controller: ProfileMainController
            },
            {
                name:"profile.followers",
                title:'Фолловеры',
                pattern:/^#\/profile\/([0-9]+)\/followers$/,
                controller: ProfileFollowersController
            },
            {
                name:"profile.following",
                title:'Подписки',
                pattern:/^#\/profile\/([0-9]+)\/following$/,
                controller: ProfileFollowingController
            }

        ],
        currentState = null;

    //Определение текущей странички по states
    var setCurrentState = function () {
        for (var i = 0; i < states.length; i++) {
            console.log(states[i].pattern.test(location.hash)+' '+location.hash);
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
            if(location.hash!==''){
                stateHandler();
            }
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