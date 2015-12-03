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
                pattern: /#\//,
                controller: SearchController
            }
        ],
        currentState = null;

    //Определение текущей странички по states
    var setCurrentState = function () {
        for (var i = 0; i < states.length; i++) {
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
    console.log("blabla");

    app.init();
});