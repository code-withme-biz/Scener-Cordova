import $$ from 'dom7';
import Framework7 from 'framework7/framework7.esm.bundle.js';
import 'framework7/css/framework7.bundle.css';
import '../css/icons.css';
import '../css/app.css';
import cordovaApp from './cordova-app.js';
import routes from './routes.js';
import data from './data.js';
import notifications from './notifications.js';
import App from '../app.f7.html';


var isFirstRun = data.load();

var app = new Framework7({
    root: '#app',
    component: App,
    id: 'com.scener.app',
    name: 'Scener',
    theme: 'ios',
    routes: routes,
    input: {
        scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
        scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
    },
    statusbar: {
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
    },
    on: {
        init: function () {
            var f7 = this;
            if (f7.device.cordova) {                
                cordovaApp.init(f7); // Init cordova APIs (see cordova-app.js)
            }
        },
        routeChange: function(newRoute, oldRoute) {
            console.log('route change url=' +  newRoute.url + ' oldRoute',oldRoute);
            //setTimeout(() => { window.scrollBy(0,0) },1000); // fix ios keyboard display bug
            console.log('newRoute',newRoute);
            let url = newRoute.url.split('/')[1];
            document.body.className = 'route-' + (url ? url:'home');
            if(!oldRoute.url && isFirstRun && newRoute.url == '/shows') {
                app.tab.show('#view-shows');
            }
            if(!app.ready) {
                app.ready = true;
                if(app.pending) {
                    showTab(app.pending.routeTab, app.pending.routeUrl);
                }
            }
        }

    },
});

app.data = data;
app.notifications = notifications;

app.connectionPopup = app.popup.create({el:'.popup-connection'})


function toggleButton(id, disable) {
    if(id) {
        let el = document.querySelector("#button-" + id);
        if (el) {
            if (disable) {
                el.setAttribute("original", el.innerText);
                el.classList.add('loading');
                el.disabled = true;
                el.innerText = disable;            
            } else {
                el.innerText = el.getAttribute("original");
                el.classList.remove('loading');
                el.disabled = false;
            }
        } else {
            console.log('button "' + id + '" not found');
        }
    }
    else {
        document.querySelectorAll('button.loading').forEach(function(el) {
            el.innerText = el.getAttribute("original");
            el.classList.remove('loading');
            el.disabled = false;
        });
    }
}
