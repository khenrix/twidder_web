update_charts = function update_charts(gData, sData, mData) {
    var genderCtx = document.getElementById("genderChart");

    var genderData = {
        labels: [
            "Male",
            "Female"
        ],
        datasets: [
            {
                data: gData,
                backgroundColor: [
                    "#800000",
                    "#000"
                ],
                hoverBackgroundColor: [
                    "#800000",
                    "#000"
                ]
            }
        ]
    };

    var genderPieChart = new Chart(genderCtx, {
        type: 'pie',
        data: genderData
    });

    var sessionCtx = document.getElementById("sessionChart");

    var sessionData = {
        labels: [
            "Online users",
            "Total users"
        ],
        datasets: [
            {
                data: sData,
                backgroundColor: [
                    "#800000",
                    "#000"
                ],
                hoverBackgroundColor: [
                    "#800000",
                    "#000"
                ]
            }
        ]
    };

    var sessionPieChart = new Chart(sessionCtx, {
        type: 'pie',
        data: sessionData
    });

    var messageCtx = document.getElementById("messageChart");

    var messageData = {
        labels: [
            "Your messages",
            "Total messages"
        ],
        datasets: [
            {
                data: mData,
                backgroundColor: [
                    "#800000",
                    "#000"
                ],
                hoverBackgroundColor: [
                    "#800000",
                    "#000"
                ]
            }
        ]
    };

    var messagePieChart = new Chart(messageCtx, {
        type: 'pie',
        data: messageData
    });
};