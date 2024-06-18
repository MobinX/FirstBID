document.querySelector('form').addEventListener('submit', function (event) {
    // Prevent the form from being submitted to the server
    event.preventDefault();

    // Get the values from the form
    var tamplate = document.querySelector('#tamplate').value;
    var portfolio = document.querySelector('#portfolio').value;

    // Log the values to the console
    console.log('Tamplate:', tamplate);
    console.log('Portfolio:', portfolio);

    chrome.storage.local.set({ tamplate: tamplate, portfolio: portfolio }, function () {
        console.log('Settings saved');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get(['tamplate', 'portfolio'], function (result) {
        if (result.tamplate) {
            document.querySelector('#tamplate').value = result.tamplate;
        }
        if (result.portfolio) {
            document.querySelector('#portfolio').value = result.portfolio;
        }
    });
});

document.onload = function () {
    let prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (prefersDarkScheme) {
        document.body.setAttribute("data-theme", "coffee");
    } else {
        document.body.setAttribute("data-theme", "cupcake");
    }
}