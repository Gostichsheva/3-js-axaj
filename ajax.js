'use strict';

const usdBaseURL = 'https://api.fixer.io/latest?base=USD&symbols=RUB';
const eurBaseURL = 'https://api.fixer.io/latest?base=EUR&symbols=RUB';
const jsonpURL = 'http://run.plnkr.co/plunks/v8xyYN64V4nqCshgjKms/data-2.json';
const postsURL = 'https://jsonplaceholder.typicode.com/posts';
const HttpStatusCode = {
    OK: 200
};
const resultDiv = $('.result');

$('.btn-group').on('click', function(event) {
    let button = event.target;
    if (button.tagName.toLowerCase() !== 'button') return;
    switch (button.id) {
        case 'nativeXhr':
            useNativeXhr();
            break;
        case 'nativeFetch':
            useNativeFetch();
            break;
        case 'scriptJsonp':
            getJsonpWithScript();
            break;
        case 'ajaxJsonp':
            getJsonpWithAjax();
            break;
        case 'ajaxGet':
            useAjaxGet();
            break;
        case 'ajaxPost':
            useAjaxPost();
            break;
        case 'get':
            useGet();
            break;
        case 'post':
            usePost();
            break;
        case 'clean':
            resultDiv.empty();
            break;
    }
});

function useNativeXhr() {
    const nativeXhr = new XMLHttpRequest();

    nativeXhr.addEventListener('readystatechange', function() {
        if (nativeXhr.readyState === nativeXhr.DONE) {
            if (nativeXhr.status === HttpStatusCode.OK) {
                try {
                    printData(JSON.parse(nativeXhr.responseText));
                } catch (xhrDataErr) {
                    printError(xhrDataErr);
                }
            } else {
                printError(nativeXhr.status);
            }
        }
    });

    nativeXhr.open('GET', usdBaseURL);
    nativeXhr.send();
}

function useNativeFetch() {
    fetch(eurBaseURL, {
            method: 'GET'
        })
        .then(function(response) {
            if (response.status === HttpStatusCode.OK)
                return response.json();
            else throw response.status;
        })
        .then(printData)
        .catch(printError);
}

function getJsonpWithScript() {
    let script = document.createElement('script');
    script.src = jsonpURL;
    document.head.appendChild(script);
}

function getJsonpWithAjax() {
    $.ajax({
        url: jsonpURL,
        type: 'GET',
        jsonp: 'jsonCallback',
        dataType: 'jsonp',
        error: function(responseInfo) {
            if (responseInfo.status !== HttpStatusCode.OK)
                printError(responseInfo.status.toString());
        }
    });
}

function useAjaxGet() {
    $.ajax({
        url: postsURL + '?userId=1',
        type: 'GET',
        datatype: 'json',
        success: printData,
        error: function(responseInfo) {
            if (responseInfo.status !== HttpStatusCode.OK)
                printError(responseInfo.status.toString());
        }
    })
}

function useAjaxPost() {
    $.ajax({
            url: postsURL,
            type: 'POST',
            datatype: 'json',
            data: {
                title: 'foo',
                body: 'bar',
                userId: 1
            }
        })
        .then(printData)
        .catch(printError);

}

function useGet() {
    $.get(postsURL + '/23', printData)
        .fail(function(responseInfo) {
            printError(responseInfo.status);
        });
}

function usePost() {
    let data = [{
        group: 'EPAM',
        users: [{
            name: "Sergey",
            git: "smolnikov"
        }, {
            name: "Vladilen",
            git: "rainman161"
        }]
    }, {
        name: "Violetta",
        git: "Gostichsheva"
    }];

    data = JSON.stringify(data);
    $.post(postsURL, {
            data: data
        }, 'json')
        .done(function(response) {
            printData(JSON.parse(response.data));
        })
        .fail(function(responseInfo) {
            printError(responseInfo.status);
        });
}

function jsonCallback(data) {
    printData(data);
}

function printError(
    error = 'unknown error',
    domParent = resultDiv.empty()
) {
    if (typeof error !== 'string') error = error.toString();

    let objectDiv = document.createElement('div');
    objectDiv.className = 'data';

    let dataField = document.createElement('span');
    dataField.className = 'error';
    dataField.textContent = error;
    objectDiv.appendChild(dataField);

    domParent.appendChild(objectDiv);
}

function printData(
    data,
    domParent = resultDiv.empty()
) {
    if (typeof data !== 'object') return;

    if (!domParent.tagName) domParent = resultDiv.empty();

    let objectDiv = document.createElement('div');
    objectDiv.className = 'data';

    for (let key in data) {
        if (data[key] instanceof Object) {
            let keyField = document.createElement('strong');
            keyField.className = 'key';
            keyField.textContent = key + ' ';
            objectDiv.appendChild(keyField);

            printData(data[key], objectDiv);
        } else {
            let innerObjectDiv = document.createElement('div');

            let keyField = document.createElement('strong');
            keyField.className = 'key';
            keyField.textContent = key + ' ';
            innerObjectDiv.appendChild(keyField);

            let dataField = document.createElement('span');
            dataField.className = 'value';
            dataField.textContent = data[key];
            innerObjectDiv.appendChild(dataField);

            objectDiv.appendChild(innerObjectDiv);
        }
    }

    domParent.append(objectDiv);
}
