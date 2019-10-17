let coursesData;
let currentOffset = 0;
let limitItemPerPage = 4;
loadData();

function loadData(callback) {
    if (coursesData) {
        callback && callback();
    } else {
        $.get("http://demo6370041.mockable.io/getcourses", function (rawData, status) {
            coursesData = rawData['data'];

            for (let i = 0; i <= coursesData.length; i++) {
                $.get(`http://demo6370041.mockable.io/course/${i + 1}`, function (data, status) {
                    coursesData[i]['description'] = data['description'];
                    coursesData[i][['textbook']] = data['textbook'];
                });
            }
            console.log(coursesData);
            callback && callback();
        });
    }
}

function displayData(offset = 0, limit = 4) {
    if (coursesData == null) return;
    let data = "";
    for (let i = offset; i < offset + limit; i++) {
        data = `${data}<tr id="course-${i + 1}" class="course-item"><td>${coursesData[i]['id']}</td><td>${coursesData[i]['name']}</td></tr>`;
    }

    $("#tb-body").html(data);

    let buttons = "";
    for (let i = 1; i < coursesData.length / 4 + 1; i++) {
        buttons = `${buttons}<button class="btn-page">${i}</button>`;
    }

    $("#btn-container").html(`<button id="btn-prev">Previous</button>${buttons}<button id="btn-next">Next</button>`);

    $("#btn-prev").click(function () {
        currentOffset = Math.max(currentOffset - limitItemPerPage, 0);
        displayData(0);
    });

    $(".btn-page").click(function () {
        currentOffset = (parseInt($(this).html()) - 1) * 4;
        displayData(currentOffset);
    });

    $("#btn-next").click(function () {
        currentOffset = Math.min(currentOffset + limitItemPerPage, coursesData.length);
        displayData(coursesData.length - limitItemPerPage);
    });

    $(".course-item").click(function () {
        let id = (parseInt($(this).attr('id').split("-")[1]));
        if (!id || !coursesData[id - 1]['description']) return;

        let courseInfo = $(`#course-${id}-expanded`);
        if (courseInfo.length > 0) {
            courseInfo.remove();
        } else {
            let tr = `<tr id="course-${id}-expanded"><td colspan="2"><p>Description: ${coursesData[id - 1]['description']}</p><p>Textbook: ${coursesData[id - 1]['textbook']}</p></td></tr>`;
            $(`#course-${id}`).after(tr);
        }
    });

    checkButtonState();
}

function checkButtonState() {
    $("#btn-prev").attr("disabled", currentOffset - limitItemPerPage < 0);
    $("#btn-next").attr("disabled", currentOffset + limitItemPerPage >= coursesData.length);
}

$(document).ready(function () {
    loadData(function () {
        displayData();
    });
});