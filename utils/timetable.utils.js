const slotToStartDate = (year, month, date, slot) => {
    let result = new Date();
    result.setFullYear(year);
    result.setMonth(month);
    result.setDate(date);
    result.setHours(Math.floor(slot/2));
    result.setMinutes(((slot % 2) === 0 ? 0 : 30));
    return result;
}

const startDateToSlot = (time) => {
    return 2*(time.getHours()) + (time.getMinutes() >= 30 ? 1 : 0);
}

const withinNextMonth = (meeting) => {
    let nextMonth = (new Date()) + 1000*3600*24*30;
    if (meeting.startTimestamp < nextMonth) return true;
    else return false;
}

const unionTimetable = (consultantTable, consultantMeetings, studentMeetings) => {
    // object template
    let result = { 
        available: consultantTable,
        consultantBooked: [],
        sutdentBooked: []
    };

    // check consultant meetings
    for (meeting of consultantMeetings.future) {
        if (withinNextMonth(meeting)) {
            let box = [meeting.startTimestamp.getMonth(), meeting.startTimestamp.getDate(), startDateToSlot(meeting.startTimestamp)];
            result.consultantBooked.push(box);
        }
    }

    // check student meetings
    for (meeting of studentMeetings.future) {
        if (withinNextMonth(meeting)) {
            let box = [meeting.startTimestamp.getMonth(), meeting.startTimestamp.getDate(), startDateToSlot(meeting.startTimestamp)];
            result.sutdentBooked.push(box);
        }
    }

    // return result
    return result;
}

module.exports = { 
    slotToStartDate,
    startDateToSlot,
    unionTimetable 
};