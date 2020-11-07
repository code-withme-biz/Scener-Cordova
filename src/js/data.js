

var API_URL = 'http://ec2-35-167-126-38.us-west-2.compute.amazonaws.com/api';

var data = {

    user: false,
    preferences: false,
    cache: [],


    init: () => {
        data.user = {
            id: false,
            friends: [],
            notifications: [],
            preferences: {}
        }
    },


    load: () => {
        console.log('data.load() - apiCache', data.apiCache);
        console.log('app',app);
        let d = window.localStorage.getItem('user');
        if(!d) {
            console.log('user not set, first time');
            data.init();
            data.save();
            return false;
        }
        else {
            data.user = JSON.parse(d);
            console.log("user loaded:",data.user);
            if(!data.user) {
                data.init();
                return false;
            }
            if(data.user.id) {
                data.api('/account/auth').then((r) => {
                    data.user = r.user;
                    data.save();
                });
            }
            if(data.preferences.notifications && !push) {
                push.init();
            }
        }
    },


    save: () => {
        console.log('saveData()');
        window.localStorage.setItem('user',JSON.stringify(data.user));
        if(data.user.id && data.user.image && document.querySelector('#tab-link-me div')) {
            document.querySelector('#tab-link-me div').innerHTML = '<img src="' + data.user.image.replace('-load','-scaled') + '" />';
        }
        else if(document.querySelector('#tab-link-me div')) {
            document.querySelector('#tab-link-me div').innerHTML = '<i class="icon f7-icons">person_fill</i>';
        }
        data.saveDeviceId();
    },

    reset: () => {
        console.log('deleteData()');
        window.localStorage.removeItem('user');
        data.init();
    },


    api: (url, post, nocache) => {
        console.log('API_URL',API_URL);
        console.log('API REQUEST: ' + url, post);
        //let childUrl = app ? app.views.current.router.url:false;    
        let request = new XMLHttpRequest();
        return new Promise((resolve, reject) => {

            if(url == '/channels') {
                let r = [{id:'1', name:'channel one' }, {id:'2', name:'channel two' } ];
                resolve(r);
            }


            if(!post && !nocache) {
                let cached = data.cache.find((c) => { return (c.url == url && (Date.now()-c.time) < 300000) });
                if(cached) {
                    console.log('returning cached', cached.response);
                    resolve(cached.response);
                    return;
                }        
            }
            request.onreadystatechange = () => {
                if(request.readyState == 4) {
                    if (request.status >= 200 && request.status < 300) {
                        try {
                            let response = JSON.parse(request.responseText);
                            console.log('API RESPONSE: ' + url, response);
                            if(response.error) {
                                if(response.error == 'NO_USER') {
                                    data.reset();
                                    showTab('home','/home');
                                }
                                else {
                                    app.dialog.alert(response.error, 'Uh Oh.', () => {
                                        toggleButton();
                                        reject(response.error);
                                    });
                                }
                            }
                            else {
                                if(!post && response) {
                                    data.cache.push({url:url, time:Date.now(), response:response});
                                }

                                if(childUrl && childUrl != app.views.current.router.url && childUrl && childUrl != 'undefined' && childUrl != '/') {
                                    console.log('bad child??: ' + childUrl + ' != ' + app.views.current.router.url);
                                    //reject('route');
                                }
                                
                                resolve(response);
                            }
                        }
                        catch(e) {
                            console.log('API ERROR', e.message)
                            toggleButton();
                            app.connectionPopup.open();
                            reject('Error: ' + e.message);
                        }
                    } 
                    else {
                        console.log('API FAILED status='+request.status);
                        app.connectionPopup.open();
                        reject({
                            status: request.status,
                            statusText: request.statusText
                        });
                    }
                }
            };
            request.open(post ? 'POST':'GET', API_URL + url, true);
            if(data.user) {
                request.setRequestHeader('token',data.user.token);
            }        
            if(post) {
                let fd = new FormData();
                for(let k in post) {
                    fd.append(k, post[k]);
                }
                request.send(fd);
            }
            else {
                request.send();
            }
        });
    },


    clearCache: () => {
        data.cache = [];
    },

    
    connectionTryAgain: () => {
        app.connectionPopup.close();
        setTimeout(() => {
            app.views.current.router.refreshPage();
        },1500);
    }

}



export default data;
