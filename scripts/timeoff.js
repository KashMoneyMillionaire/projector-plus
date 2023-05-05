console.log('Running Timeoff for Projector Plus');

// The current /timeoff page does not display your current available time off.
// There is a work around by going through the submit process of new PTO to see
// how much is left. We leverage this underlying call to find our current total
// and display it on the page
(async function () {
    'use strict';


    const requestDate = new Date().toJSON().substring(0, 10);
    const body = {
        "rq": {
            "ApproverComment": "",
            "BeginDate": requestDate,
            "CheckOnlyFlag": false,
            "DailyTimeOffMinutes": null,
            "EmailApproverUserIDs": [],
            "EndDate": requestDate,
            "TimeOffComment": "",
            "TimeOffReasonId": 22429,
            "TimeOffReasonName": "PTO"
        }
    };

    // Call the endpoint that occurs when you click the first submit button
    const response = await fetch("https://app.projectorpsa.com/Timeoff/home/AjxCheckResourcePTO", {
        "headers": {
            "__requestverificationtoken": window.ppsa.request_verification_token,
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json; charset=UTF-8",
            "sessiontoken": window.ppsa.session_token,
        },
        "referrer": "https://app.projectorpsa.com/timeoff",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify(body),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });

    const json = await response.json();

    /*
    {
        "TotalEffectiveTimeOffMinutes": 480,
        "OverallocationFlag": false,
        "AvailableTimeOffBalance": 720,
        "refid": null,
        "Status": 0,
        "Messages": null,
        "ClientUserAccessRestrictedFlag": false,
        "LimitedUserAccessRestrictedFlag": false
    }
    */
    console.log(json);

    // The TotalEffectiveTimeOffMinutes is how many minutes you're requesting off from the request above.
    // We're requesting a whole day, so it SHOULD be 480 minutes (8 hrs). On weekends, it returns 0.
    // We then add this to the AvailableTimeOffBalance, which is how many mins we'd have off after the
    // "requested" full day we sent. 
    // These combined is how many total days we have off.
    const totalDays = (json.TotalEffectiveTimeOffMinutes + json.AvailableTimeOffBalance) / 60.0;
    console.log("Total Days: " + totalDays);

    const unset = setInterval(() => {
        const header = $('div.headerReason').toArray()[0];
        if (!header?.children)
            return;

        const cell = header.children[4];
        cell.innerText = `Current: ${totalDays.round(2)}\nEOY: ${cell.innerText}`;
        clearInterval(unset);
    }, 500);

})();