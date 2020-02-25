$.ajax({
    type: 'GET',
    url: 'https://wakatime.com/share/@simon/67d11a16-44ef-45ca-be0a-e35b2b235d8f.json',
    dataType: 'jsonp',
    success: function (response) {
        $(document).ready(function () {
            const languagesList = document.getElementById('languages-list');
            let list = response.data;
            for (let i = 0; i < Math.min(list.length, 10); i++) {
                let lang = list[i];
                let langName = lang['name'];
                let langPercent = parseFloat(lang['percent']);

                const item = document.createElement("li");
                item.className = `list-item item-${i}`;
                item.innerHTML = lang['name'] + "(0.0%)";
                languagesList.appendChild(item);

                let currentItem = $(`.item-${i}`);

                $({ percentage: 0 }).stop(true).animate({ percentage: langPercent }, {
                    duration: 2000,
                    easing: "easeOutExpo",
                    step: function () {
                        currentItem.text(`${langName} (${this.percentage.toFixed(2)}%)`);
                    }
                }).promise().done(function () {
                    // hard set the value after animation is done to be
                    // sure the value is correct
                    currentItem.text(`${langName} (${langPercent.toFixed(2)}%)`);
                });
            }
        });
    },
});
